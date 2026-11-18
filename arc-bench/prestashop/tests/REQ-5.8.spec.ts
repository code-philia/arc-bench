// requirement: REQ-5.8
import { test, expect } from '@playwright/test';
import { home, action, region, expectMoney, checkoutSetup, paymentStep, choice, orderConfirmationHeading, STEP } from './helpers';

test("REQ-5.8: Reopen completed shipping step", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_invoice_user');
  await paymentStep(page, address.alias);
  await action(page, 'Edit Shipping Method').click();
  const shipping = region(page, 'Shipping Method');
  await expect(choice(shipping, 'radio', 'Delivery')).toBeChecked();
  await action(shipping, 'Continue').click();
  await expect(choice(region(page, 'Payment'), 'radio', 'Bank wire')).toBeVisible();
  const summary = region(page, 'Order summary');
  await expect(summary).toContainText(STEP);
  await expectMoney(region(summary, 'Total'), 31);
  await expect(orderConfirmationHeading(page)).toHaveCount(0);
});
