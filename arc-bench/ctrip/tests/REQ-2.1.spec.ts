// requirement: REQ-2.1
import { test, expect } from "@playwright/test";
import { field, button, radio, visible, openHome, installClock } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.1: Switch one-way and round-trip modes', async ({ page }, testInfo) => {
  await openHome(page);
  await expect(radio(page, 'One way')).toBeChecked();
  await visible(button(page, 'Add return'));
  await expect(field(page, 'Return date')).toHaveCount(0);
  await radio(page, 'Round trip').check();
  await visible(field(page, 'Return date'));
  await radio(page, 'One way').check();
  await expect(field(page, 'Return date')).toHaveCount(0);
  await visible(button(page, 'Add return'));
  await visible(radio(page, 'Multi-city'));
});

