import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: transfer_only_route

test('REQ-3.3.1: Display transfer plans after a no-direct-train search', async ({ page }) => {
  await h.openTransferResults(page);
  await h.expectTextsVisible(page, ['Transfer']);
  const durations = await page.locator('.transfer-plan').evaluateAll((plans) => plans.map((plan) => Number(plan.getAttribute('data-travel'))));
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.length).toBeLessThanOrEqual(10);
  expect(durations).toEqual([...durations].sort((a, b) => a - b));
  const waits = await page.locator('.transfer-plan').evaluateAll((plans) => plans.map((plan) => Number(plan.getAttribute('data-wait'))));
  expect(waits.every((minutes) => minutes >= 30)).toBeTruthy();
});
