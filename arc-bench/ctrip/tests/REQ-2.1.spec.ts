// requirement: REQ-2.1
import { expect } from "@playwright/test";
import { test, setChecked, field, button, radio, visible, openHome } from "./helpers";

test('REQ-2.1: Switch one-way and round-trip modes', async ({ page }) => {
  await openHome(page);
  await expect(radio(page, 'One way')).toBeChecked();
  await visible(button(page, 'Add return'));
  await expect(field(page, 'Return date')).toHaveCount(0);
  await setChecked(radio(page, 'Round trip'));
  await visible(field(page, 'Return date'));
  await setChecked(radio(page, 'One way'));
  await expect(field(page, 'Return date')).toHaveCount(0);
  await visible(button(page, 'Add return'));
  await visible(radio(page, 'Multi-city'));
});
