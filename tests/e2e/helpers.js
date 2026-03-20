import { expect } from '@playwright/test';

export async function installMediaAndWindowSpies(page) {
  await page.addInitScript(() => {
    window.__E2E__ = true;
    window.__playedAudio = [];
    window.__playedAudioEvents = [];
    window.__speechSynthesisSpeakCalls = 0;
    window.__speechSynthesisUtterances = [];
    window.__openedUrls = [];
    window.__copiedText = '';
    window.__confirmMessages = [];
    window.__wakeLockRequests = [];
    window.__wakeLockReleases = 0;

    const originalOpen = window.open;
    window.open = (...args) => {
      window.__openedUrls.push(args[0]);
      return originalOpen ? originalOpen.apply(window, args) : null;
    };

    window.confirm = (message) => {
      window.__confirmMessages.push(message);
      return true;
    };

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__copiedText = value;
        },
      },
    });

    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: {
        request: async (type) => {
          window.__wakeLockRequests.push(type);
          return {
            released: false,
            async release() {
              this.released = true;
              window.__wakeLockReleases += 1;
            },
            addEventListener() {},
            removeEventListener() {},
          };
        },
      },
    });

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = (utterance) => {
        window.__speechSynthesisSpeakCalls += 1;
        window.__speechSynthesisUtterances.push(utterance?.text || '');
        if (typeof utterance?.onend === 'function') {
          queueMicrotask(() => utterance.onend(new Event('end')));
        }
      };
      window.speechSynthesis.getVoices = () => [];
    }

    const mediaPlaybackState = new WeakMap();

    const setMediaState = (element, nextState) => {
      const currentState = mediaPlaybackState.get(element) || { paused: true, ended: true };
      mediaPlaybackState.set(element, { ...currentState, ...nextState });
    };

    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      configurable: true,
      get() {
        return (mediaPlaybackState.get(this) || { paused: true }).paused;
      },
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
      configurable: true,
      get() {
        return (mediaPlaybackState.get(this) || { ended: true }).ended;
      },
    });

    HTMLMediaElement.prototype.pause = function pause() {
      setMediaState(this, { paused: true, ended: true });
    };

    HTMLMediaElement.prototype.play = function play() {
      const src = this.src || this.currentSrc;
      setMediaState(this, { paused: false, ended: false });
      window.__playedAudio.push(src);
      window.__playedAudioEvents.push({ src, time: Date.now() });
      queueMicrotask(() => {
        setMediaState(this, { paused: true, ended: true });
        if (typeof this.onended === 'function') {
          this.onended(new Event('ended'));
        }
      });
      return Promise.resolve();
    };
  });
}

export async function launchHarness(page) {
  await page.goto('/');
  await page.getByTestId('launch-harness-button').click();
  await expect(page.getByTestId('navigation-screen')).toBeVisible();
}

export async function enableGpsAndPrepareTour(page) {
  await page.goto('/');
  await page.getByTestId('enable-gps-button').click();
}

export async function readStoredState(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('pr-driving-tour-state') || 'null'));
}

export async function expectInViewport(page, locator) {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
}