import { expect, test } from '@playwright/test';
import { installMediaAndWindowSpies, launchHarness } from './helpers';

test.describe('Regression: audio playback paths', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await installMediaAndWindowSpies(page);
  });

  test('normal mode keeps local maneuver guidance active in the UI', async ({ page }) => {
    await launchHarness(page);

    await expect(page.getByText(/maneuvers stored locally/i)).toBeVisible();
  });

  test('test harness preview starts one pre-rendered narration and no TTS fallback', async ({ page }) => {
    await launchHarness(page);
    await page.getByTestId('harness-collapse-toggle').click();

    await page.getByTestId('harness-preview-poi').click({ force: true });

    await expect(page.getByTestId('poi-alert')).toBeVisible();
    await expect.poll(async () => {
      return page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')).length);
    }).toBe(1);

    const playedAudio = await page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')));
    expect(playedAudio).toHaveLength(1);

    const speechCalls = await page.evaluate(() => window.__speechSynthesisSpeakCalls);
    expect(speechCalls).toBe(0);
  });

  test('POI replay uses one additional pre-rendered narration and no TTS fallback', async ({ page }) => {
    await launchHarness(page);
    await page.getByTestId('harness-collapse-toggle').click();

    await page.getByTestId('harness-preview-poi').click({ force: true });
    await expect(page.getByTestId('poi-alert')).toBeVisible();
    await expect.poll(async () => {
      return page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')).length);
    }).toBe(1);

    await page.evaluate(() => {
      document.querySelector('[data-testid="poi-alert"] button.poi-alert__btn--secondary')?.click();
    });

    await expect.poll(async () => {
      return page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')).length);
    }).toBe(2);

    const playedAudio = await page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')));
    expect(playedAudio).toHaveLength(2);

    const speechCalls = await page.evaluate(() => window.__speechSynthesisSpeakCalls);
    expect(speechCalls).toBe(0);
  });

  test('Android Auto mode suppresses local direction prompts and keeps POI narration active', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('external-navigation-mode-checkbox').check();
    await page.getByTestId('launch-harness-button').click();
    await page.getByTestId('harness-collapse-toggle').click();

    await expect(page.getByTestId('navigation-screen')).toBeVisible();
    await expect(page.getByTestId('active-tour-external-navigation-toggle')).toHaveAttribute('aria-pressed', 'true');

    const storedState = await page.evaluate(() => JSON.parse(localStorage.getItem('pr-driving-tour-state') || 'null'));
    expect(storedState?.externalNavigationMode).toBe(true);

    const directionAudio = await page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/directions/')));
    expect(directionAudio).toHaveLength(0);

    const previewClickTime = await page.evaluate(() => Date.now());
    await page.getByTestId('harness-preview-poi').click({ force: true });
    await expect(page.getByTestId('poi-alert')).toBeVisible();

    await expect.poll(async () => {
      return page.evaluate(() => window.__playedAudio.filter((value) => value.includes('/audio/en/pois/')).length);
    }, { timeout: 8000 }).toBe(1);

    const firstPoiAudioDelay = await page.evaluate((clickTime) => {
      const event = window.__playedAudioEvents.find((entry) => entry.src.includes('/audio/en/pois/'));
      return event ? event.time - clickTime : null;
    }, previewClickTime);
    expect(firstPoiAudioDelay).not.toBeNull();
    expect(firstPoiAudioDelay).toBeGreaterThanOrEqual(5000);

    const speechCalls = await page.evaluate(() => window.__speechSynthesisSpeakCalls);
    expect(speechCalls).toBe(0);

    await page.reload();
    await expect(page.getByTestId('navigation-screen')).toBeVisible();
    await expect(page.getByTestId('active-tour-external-navigation-toggle')).toHaveAttribute('aria-pressed', 'true');
  });
});