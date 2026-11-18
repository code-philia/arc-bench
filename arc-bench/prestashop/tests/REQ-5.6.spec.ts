// requirement: REQ-5.6
import { test, expect } from '@playwright/test';
import { home, nav, action, region, expectMoney, checkoutSetup, paymentStep, placeOrder, field, expectOrderReference, orderConfirmationHeading, signedInNav } from './helpers';

test("REQ-5.6: Place order for selected product", async ({ page }) => {
  await home(page);
  const product = 'Hummingbird order-confirmation t-shirt';
  const address = await checkoutSetup(page, product, 'checkout_6_6_user');
  await paymentStep(page, address.alias);
  await placeOrder(page);
  await expect(orderConfirmationHeading(page)).toBeVisible();
  await expect(region(page, 'Order details')).toContainText(product);
});

test("REQ-5.6: Inspect completed order and continue shopping", async ({ page }) => {
  await home(page);
  const product = 'Hummingbird order-complete t-shirt';
  const address = await checkoutSetup(page, product, 'checkout_6_7_user');
  await paymentStep(page, address.alias);
  await placeOrder(page);
  await expect(orderConfirmationHeading(page)).toBeVisible();
  await expectOrderReference(page);
  const details = region(page, 'Order details');
  for (const text of [product, 'Delivery', 'Bank wire', address.Address]) await expect(details).toContainText(text);
  await expect(details).toContainText(/Quantity\s*:?\s*1(?![\d.])/);
  await expectMoney(region(details, 'Total'), 33);
  await action(page, 'Continue shopping').click();
  await expect(page.getByRole('heading', { name: 'Popular Products', exact: true })).toBeVisible();
  await expect(field(nav(page), 'Search')).toBeVisible();
  await signedInNav(page);
});
