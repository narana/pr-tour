import { expect } from '@playwright/test';

export async function installMediaAndWindowSpies(page) {
  await page.addInitScript(() => {
    window.__E2E__ = true;
    window.__playedAudio = [];
    window.__speechSynthesisSpeakCalls = 0;
    window.__openedUrls = [];
    window.__copiedText = '';
    window.__confirmMessages = [];

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

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = () => {
        window.__speechSynthesisSpeakCalls += 1;
      };
      window.speechSynthesis.getVoices = () => [];
    }

    HTMLMediaElement.prototype.play = function play() {
      window.__playedAudio.push(this.currentSrc || this.src);
      queueMicrotask(() => {
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