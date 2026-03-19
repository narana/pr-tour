import { test } from '@playwright/test';
import { installMediaAndWindowSpies, launchHarness, expectInViewport } from './helpers';

test.describe('Regression: mobile layout tapability', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await installMediaAndWindowSpies(page);
  });

  test('active-tour bottom controls remain inside the mobile viewport', async ({ page }) => {
    await launchHarness(page);

    await expectInViewport(page, page.getByTestId('pause-tour-button'));
    await expectInViewport(page, page.getByTestId('open-replay-drawer-button'));
    await expectInViewport(page, page.getByTestId('toggle-volume-button'));
    await expectInViewport(page, page.getByTestId('reset-tour-button'));
  });

  test('mobile Google Maps handoff controls remain tappable in the viewport', async ({ page }) => {
    await launchHarness(page);

    await expectInViewport(page, page.getByTestId('google-maps-native-button'));
    await expectInViewport(page, page.getByTestId('google-maps-overview-link'));
    await expectInViewport(page, page.getByTestId('copy-destination-button'));
  });
});