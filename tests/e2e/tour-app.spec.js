import { expect, test } from '@playwright/test';
import { installMediaAndWindowSpies, readStoredState } from './helpers';

test.describe('Pre-tour permissions', () => {
  test('shows helpful blocked-permission messaging when geolocation is denied', async ({ page, context }) => {
    await context.clearPermissions();
    await page.goto('/');

    await page.getByTestId('enable-gps-button').click();

    await expect(page.getByText(/Location permission denied\. Please enable GPS access/i)).toBeVisible();
    await expect(page.getByTestId('permission-help')).toBeVisible();
    await expect(page.getByTestId('start-tour-button')).toHaveCount(0);
  });

  test('granted geolocation enables route-lock start from current position', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 18.2395442, longitude: -66.0622302 });
    await page.goto('/');

    await page.getByTestId('enable-gps-button').click();

    await expect(page.getByTestId('route-lock-title')).toContainText('GPS locked to route');
    await expect(page.getByTestId('start-from-current-button')).toBeEnabled();
  });

  test('off-route geolocation offers Google Maps recovery guidance', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await installMediaAndWindowSpies(page);
    await context.setGeolocation({ latitude: 18.2011, longitude: -67.1396 });
    await page.goto('/');

    await page.getByTestId('enable-gps-button').click();

    await expect(page.getByTestId('route-lock-title')).toContainText('GPS not yet on route');
    await expect(page.getByTestId('start-from-current-button')).toBeDisabled();
    await expect(page.getByTestId('guide-to-route-button')).toBeVisible();

    await page.getByTestId('guide-to-route-button').click();
    await expect.poll(async () => page.evaluate(() => window.__openedUrls.length)).toBeGreaterThan(0);
    await expect(page.getByTestId('status-toast')).toContainText(/Google Maps/i);
  });
});

test.describe('Active tour interactions', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await installMediaAndWindowSpies(page);
  });

  test('manual harness previews POI media and exposes Android navigation controls', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('launch-harness-button').click();
    await expect(page.getByTestId('navigation-screen')).toBeVisible();
    await expect(page.getByTestId('test-harness')).toBeVisible();
    await expect(page.getByTestId('harness-collapse-toggle')).toHaveAttribute('aria-expanded', 'false');
    await page.getByTestId('harness-collapse-toggle').click();
    await expect(page.getByTestId('harness-collapse-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('google-maps-destination')).toBeVisible();
    await expect(page.getByTestId('google-maps-native-button')).toBeVisible();
    await expect(page.getByTestId('google-maps-overview-link')).toHaveAttribute('href', /google\.com\/maps\/dir/);
    await expect(page.getByTestId('copy-destination-button')).toBeVisible();

    await page.evaluate(() => {
      document.querySelector('[data-testid="google-maps-native-button"]')?.click();
    });
    await expect(page.getByTestId('status-toast')).toContainText(/Opening Google Maps/i);
    await expect.poll(async () => page.evaluate(() => window.__openedUrls.length)).toBeGreaterThan(0);

    await page.evaluate(() => {
      document.querySelector('[data-testid="copy-destination-button"]')?.click();
    });
    await expect(page.getByTestId('status-toast')).toContainText(/Copied/i);
    await expect.poll(async () => page.evaluate(() => window.__copiedText)).toContain(' - ');

    await page.getByTestId('harness-preview-poi').click({ force: true });
    await expect.poll(async () => {
      return page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')).length);
    }).toBe(1);

    const playedAudio = await page.evaluate(() => window.__playedAudio);
    expect(playedAudio.some((value) => value.includes('/audio/en/pois/'))).toBeTruthy();
  });

  test('map pan reveals recenter control', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('launch-harness-button').click();
    await page.getByTestId('harness-collapse-toggle').click();

    await page.getByTestId('harness-pan-map').click({ force: true });

    const recenterButton = page.getByTestId('recenter-button');
    await expect(recenterButton).toBeVisible();
    await page.evaluate(() => {
      document.querySelector('[data-testid="recenter-button"]')?.click();
    });
    await expect(recenterButton).toBeHidden();
  });

  test('start from current location advances route progress', async ({ page, context }) => {
    await context.setGeolocation({ latitude: 18.2395442, longitude: -66.0622302 });
    await page.goto('/');

    await page.getByTestId('enable-gps-button').click();
    await page.getByTestId('start-from-current-button').click({ force: true });

    await expect(page.getByTestId('navigation-screen')).toBeVisible({ timeout: 10000 });
    const savedState = await readStoredState(page);
    expect(savedState.currentStepIndex).toBeGreaterThan(0);
  });

  test('pause, resume, volume toggle, and replay drawer all respond', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('launch-harness-button').click();
    await page.getByTestId('harness-collapse-toggle').click();
    await page.evaluate(() => {
      window.__tourTestApi.dispatch({ type: 'ADD_TRIGGERED_POI', payload: 'caguas-botanical-garden' });
      window.__tourTestApi.dispatch({ type: 'VISIT_POI', payload: 'caguas-botanical-garden' });
    });

    await expect.poll(async () => page.evaluate(() => {
      return window.__tourTestApi.getState().triggeredPOIs.length;
    })).toBeGreaterThan(0);
    await expect.poll(async () => page.evaluate(() => {
      return Boolean(
        document.querySelector('[data-testid="harness-open-replay"]') ||
        document.querySelector('[data-testid="open-replay-drawer-button"]') ||
        window.__tourNavigationTestApi?.openReplayDrawer
      );
    })).toBeTruthy();
    await page.evaluate(() => {
      document.querySelector('[data-testid="harness-open-replay"]')?.click()
        || document.querySelector('[data-testid="open-replay-drawer-button"]')?.click()
        || window.__tourNavigationTestApi?.openReplayDrawer();
    });
    await expect.poll(async () => page.evaluate(() => {
      return Boolean(document.querySelector('[data-testid="replay-drawer"]'));
    })).toBeTruthy();
    await page.evaluate(() => {
      document.querySelector('[data-testid="close-replay-drawer-button"]')?.click()
        || window.__tourNavigationTestApi?.closeReplayDrawer();
    });
    await expect(page.getByTestId('replay-drawer')).toHaveCount(0);

    await page.evaluate(() => {
      document.querySelector('[data-testid="pause-tour-button"]')?.click();
    });
    await expect.poll(async () => page.evaluate(() => {
      return JSON.parse(localStorage.getItem('pr-driving-tour-state') || '{}').isPaused;
    })).toBeTruthy();
    await expect.poll(async () => page.evaluate(() => {
      return Boolean(document.querySelector('[data-testid="pause-screen"]'));
    })).toBeTruthy();
    await page.evaluate(() => {
      document.querySelector('[data-testid="pause-screen-resume-button"]')?.click();
    });
    await expect.poll(async () => page.evaluate(() => {
      return Boolean(document.querySelector('[data-testid="pause-screen"]'));
    })).toBeFalsy();

    const initialVolumeLabel = await page.evaluate(() => {
      return document.querySelector('[data-testid="toggle-volume-button"]')?.textContent;
    });
    await page.evaluate(() => {
      document.querySelector('[data-testid="toggle-volume-button"]')?.click();
    });
    await expect.poll(async () => page.evaluate(() => {
      return document.querySelector('[data-testid="toggle-volume-button"]')?.textContent;
    })).not.toBe(initialVolumeLabel);
  });
});