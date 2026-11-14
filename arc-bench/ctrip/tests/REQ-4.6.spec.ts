// requirement: REQ-4.6
import { expect } from "@playwright/test";
import { test, button, region, dialog, visible, textVisible, openHome, bookUnpaidOrder } from "./helpers";

test('REQ-4.6: Keep an unpaid order when cancellation is declined', async ({ page }) => {
  await openHome(page);
  const number = await bookUnpaidOrder(page);
  await button(region(page, 'Payment status'), 'Cancel order').click();
  await button(dialog(page, 'Cancel order'), 'Keep order').click();
  await expect(dialog(page, 'Cancel order')).toHaveCount(0);
  await textVisible(page, number);
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await visible(button(region(page, 'Payment status'), 'Pay now'));
});
