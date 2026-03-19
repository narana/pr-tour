import { expect, test } from '@playwright/test';
import { installMediaAndWindowSpies, launchHarness, readStoredState } from './helpers';

test.describe('Regression: reset and saved state', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await installMediaAndWindowSpies(page);
  });

  test('reset button clears active tour state and returns to pre-tour', async ({ page }) => {
    await launchHarness(page);

    await page.getByTestId('reset-tour-button').click();

    await expect(page.getByText('Puerto Rico Heritage & Nature Tour')).toBeVisible();
    await expect(page.getByTestId('navigation-screen')).toHaveCount(0);
    await expect.poll(async () => readStoredState(page)).toBeNull();
  });

  test('pause-screen reset clears paused progress and returns to pre-tour', async ({ page }) => {
    await launchHarness(page);

    await page.getByTestId('pause-tour-button').click();
    await expect(page.getByTestId('pause-screen')).toBeVisible();

    await page.getByTestId('pause-screen-reset-button').click();

    await expect(page.getByText('Puerto Rico Heritage & Nature Tour')).toBeVisible();
    await expect(page.getByTestId('pause-screen')).toHaveCount(0);
    await expect.poll(async () => readStoredState(page)).toBeNull();
  });

  test('saved active progress restores on reload until user resets it', async ({ page }) => {
    await launchHarness(page);
    await expect.poll(async () => readStoredState(page)).not.toBeNull();

    await page.reload();
    await expect(page.getByTestId('navigation-screen')).toBeVisible();

    await page.getByTestId('reset-tour-button').click();
    await expect(page.getByText('Puerto Rico Heritage & Nature Tour')).toBeVisible();
    await expect.poll(async () => readStoredState(page)).toBeNull();
  });

  test('active tour requests a screen wake lock', async ({ page }) => {
    await launchHarness(page);

    await expect.poll(async () => {
      return page.evaluate(() => window.__wakeLockRequests);
    }).toContain('screen');
  });

  test('active-tour Android Auto toggle updates and persists without leaving navigation', async ({ page }) => {
    await launchHarness(page);

    const toggle = page.getByTestId('active-tour-external-navigation-toggle');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('external-navigation-mode-badge')).toBeVisible();
    await expect(page.getByTestId('external-navigation-mode-note')).toBeVisible();
    await expect.poll(async () => (await readStoredState(page))?.externalNavigationMode).toBe(true);

    await page.reload();
    await expect(page.getByTestId('navigation-screen')).toBeVisible();
    await expect(page.getByTestId('active-tour-external-navigation-toggle')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('active-tour-external-navigation-toggle').click();
    await expect(page.getByTestId('active-tour-external-navigation-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('external-navigation-mode-badge')).toHaveCount(0);
    await expect(page.getByTestId('external-navigation-mode-note')).toHaveCount(0);
    await expect.poll(async () => (await readStoredState(page))?.externalNavigationMode).toBe(false);
  });

  test('jumping ahead in the harness marks earlier POIs as visited', async ({ page }) => {
    await launchHarness(page);

    await page.getByTestId('harness-collapse-toggle').click();
    await expect(page.getByTestId('harness-selected-poi')).toContainText('Selected:');

    await page.getByTestId('harness-next-poi').click();

    await expect.poll(async () => {
      const storedState = await readStoredState(page);
      return storedState?.visitedPOIs?.length || 0;
    }).toBeGreaterThan(0);
  });
});