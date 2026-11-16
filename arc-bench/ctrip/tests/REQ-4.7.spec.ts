// requirement: REQ-4.7
import { expect } from "@playwright/test";
import { test, accountDestination, region, tab, records, openHome, openOrders, ORDERS, registerAccount, bookUnpaidOrder, orderRecord, signedOut } from "./helpers";

test('REQ-4.7: Keep order lists scoped to the current account', async ({ page }) => {
  await openHome(page);
  const otherOrder = await bookUnpaidOrder(page);
  await openHome(page);
  await accountDestination(page, 'Log out');
  await signedOut(page);
  await registerAccount(page);
  await openOrders(page);
  await tab(page, 'All orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(0);
  for (const number of [ORDERS.pending.number, ORDERS.upcoming.number, ORDERS.review.number, otherOrder]) {
    await expect(orderRecord(region(page, 'Order list'), number)).toHaveCount(0);
  }
});
