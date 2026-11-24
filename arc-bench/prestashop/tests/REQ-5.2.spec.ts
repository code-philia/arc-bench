// requirement: REQ-5.2
import { test, expect } from '@playwright/test';
import { home, action, region, checkoutSetup, choice, setChoice, STEP } from './helpers';

test("REQ-5.2: Select Home address", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_address_user');
  const addresses = region(page, 'Addresses');
  await setChoice(choice(addresses, 'radio', address.alias));
  await expect(addresses).toContainText(address.Address);
  await action(addresses, 'Continue').click();
  await expect(region(page, 'Shipping Method')).toBeVisible();
  await expect(region(page, 'Order summary')).toContainText(STEP);
});
