import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await page.addInitScript(() => {
    window.__playedAudio = [];
    window.__openedUrls = [];

    const originalOpen = window.open;
    window.open = (...args) => {
      window.__openedUrls.push(args[0]);
      return originalOpen ? originalOpen.apply(window, args) : null;
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = () => {};
      window.speechSynthesis.getVoices = () => [];
    }

    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function play() {
      window.__playedAudio.push(this.currentSrc || this.src);
      queueMicrotask(() => {
        if (typeof this.onended === 'function') {
          this.onended(new Event('ended'));
        }
      });
      return Promise.resolve(originalPlay ? undefined : undefined);
    };
  });
});

test('manual harness can preview POI media and exposes Android navigation controls', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('launch-harness-button').click();
  await expect(page.getByTestId('navigation-screen')).toBeVisible();
  await expect(page.getByTestId('test-harness')).toBeVisible();
  await expect(page.getByTestId('google-maps-native-button')).toBeVisible();
  await expect(page.getByTestId('google-maps-overview-link')).toHaveAttribute('href', /google\.com\/maps\/dir/);

  const selectedLabel = page.getByTestId('harness-selected-poi');
  await expect(selectedLabel).toContainText('Selected:');

  await page.getByTestId('harness-preview-poi').click({ force: true });
  await expect.poll(async () => page.evaluate(() => window.__playedAudio.length)).toBeGreaterThan(0);

  const playedAudio = await page.evaluate(() => window.__playedAudio);
  expect(playedAudio.some((value) => value.includes('/audio/en/pois/'))).toBeTruthy();
});

test('map pan reveals recenter control', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('launch-harness-button').click();

  await page.getByTestId('harness-pan-map').click({ force: true });

  const recenterButton = page.getByTestId('recenter-button');
  await expect(recenterButton).toBeVisible();
  await page.evaluate(() => {
    document.querySelector('[data-testid="recenter-button"]')?.click();
  });
  await expect(recenterButton).toBeHidden();
});

test('GPS route lock allows starting from current location', async ({ page, context }) => {
  await context.setGeolocation({ latitude: 18.2395442, longitude: -66.0622302 });
  await page.goto('/');

  await page.getByTestId('enable-gps-button').click();
  await expect(page.getByTestId('route-lock-title')).toContainText('GPS locked to route');

  const startFromCurrent = page.getByTestId('start-from-current-button');
  await expect(startFromCurrent).toBeEnabled();
  await startFromCurrent.click({ force: true });

  await expect(page.getByTestId('navigation-screen')).toBeVisible({ timeout: 10000 });
  const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('pr-driving-tour-state') || '{}'));
  expect(savedState.currentStepIndex).toBeGreaterThan(0);
});