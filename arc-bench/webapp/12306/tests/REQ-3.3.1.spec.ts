import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: transfer_only_route

test('REQ-3.3.1: Display transfer plans after a no-direct-train search', async ({ page }) => {
  await h.openTransferResults(page);
  await h.expectTextsVisible(page, ['Transfer']);
  const durationTexts = await page.getByText(/Total travel time:\s*\d+\s*minutes/i).allTextContents();
  const durations = durationTexts.map((text) => Number(text.match(/\d+/)?.[0]));
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.length).toBeLessThanOrEqual(10);
  expect(durations).toEqual([...durations].sort((a, b) => a - b));
  const waitTexts = await page.getByText(/Transfer waiting\s+\d+h\s*\d+m/i).allTextContents();
  const waits = waitTexts.map((text) => {
    const parts = text.match(/(\d+)h\s*(\d+)m/i);
    return Number(parts?.[1]) * 60 + Number(parts?.[2]);
  });
  expect(waits.length).toBe(durations.length);
  expect(waits.every((minutes) => minutes >= 30)).toBeTruthy();
});
