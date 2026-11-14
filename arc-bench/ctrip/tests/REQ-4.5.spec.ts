// requirement: REQ-4.5
import { test, button, region, dialog, textVisible, openHome, bookUnpaidOrder, visible } from "./helpers";

test('REQ-4.5: Confirm unpaid order cancellation', async ({ page }) => {
  await openHome(page);
  const number = await bookUnpaidOrder(page);
  await button(region(page, 'Payment status'), 'Cancel order').click();
  await visible(dialog(page, 'Cancel order'));
  await button(dialog(page, 'Cancel order'), 'Confirm cancellation').click();
  await textVisible(page, number);
  await textVisible(region(page, 'Payment status'), 'Closed');
  await page.reload();
  await textVisible(page, number);
  await textVisible(region(page, 'Payment status'), 'Closed');
});
