// requirement: REQ-3.4
import { test, field, button, dialog, visible, openHome, openBooking } from "./helpers";

test('REQ-3.4: Open booking passenger dialog', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await button(page, 'Add passenger').click();
  await visible(dialog(page, 'Add passenger'));
  await visible(field(dialog(page, 'Add passenger'), 'Full name'));
  await visible(field(dialog(page, 'Add passenger'), 'ID number'));
});
