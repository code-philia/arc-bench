// requirement: REQ-4.2
import { expect } from "@playwright/test";
import { test, button, region, tab, orderRecord, records, visible, textVisible, openHome, openOrders, ORDERS } from "./helpers";

test('REQ-4.2: Filter pending payment', async ({ page }) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Pending payment').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(orderRecord(region(page, 'Order list'), ORDERS.pending.number), 'Pending payment');
  await expect(orderRecord(region(page, 'Order list'), ORDERS.upcoming.number)).toHaveCount(0);
  await expect(orderRecord(region(page, 'Order list'), ORDERS.review.number)).toHaveCount(0);
  await visible(button(orderRecord(region(page, 'Order list'), ORDERS.pending.number), 'Pay now'));
});

test('REQ-4.2: Filter not traveled', async ({ page }) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Not traveled').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(orderRecord(region(page, 'Order list'), ORDERS.upcoming.number), 'Not traveled');
  await expect(orderRecord(region(page, 'Order list'), ORDERS.pending.number)).toHaveCount(0);
  await expect(orderRecord(region(page, 'Order list'), ORDERS.review.number)).toHaveCount(0);
});

test('REQ-4.2: Filter pending review', async ({ page }) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Pending review').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(orderRecord(region(page, 'Order list'), ORDERS.review.number), 'Pending review');
  await expect(orderRecord(region(page, 'Order list'), ORDERS.pending.number)).toHaveCount(0);
  await expect(orderRecord(region(page, 'Order list'), ORDERS.upcoming.number)).toHaveCount(0);
});

test('REQ-4.2: Show all account orders', async ({ page }) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'All orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(3);
  for (const order of [ORDERS.pending, ORDERS.upcoming, ORDERS.review]) {
    const row = orderRecord(region(page, 'Order list'), order.number);
    await textVisible(row, order.flight);
    await textVisible(row, `¥${order.total}`);
    await textVisible(row, order.status);
  }
});
