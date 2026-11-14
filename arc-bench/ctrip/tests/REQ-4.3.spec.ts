// requirement: REQ-4.3
import { expect } from "@playwright/test";
import { test, field, button, region, orderRecord, records, textVisible, openHome, openOrders, ORDERS } from "./helpers";

test('REQ-4.3: Find exact order number', async ({ page }) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await field(page, 'Order number').fill(ORDERS.pending.number);
  await button(page, 'Search orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(orderRecord(region(page, 'Order list'), ORDERS.pending.number), 'JD5162');
  await expect(orderRecord(region(page, 'Order list'), ORDERS.upcoming.number)).toHaveCount(0);
  await expect(orderRecord(region(page, 'Order list'), ORDERS.review.number)).toHaveCount(0);
});
