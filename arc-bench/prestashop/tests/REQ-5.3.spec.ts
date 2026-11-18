// requirement: REQ-5.3
import { test, expect } from '@playwright/test';
import { home, action, region, cartSetup, loginExisting, addressesStep, fillAddress, choice, STEP } from './helpers';
import { addressInput } from './fixtures/data';

test("REQ-5.3: Save new checkout address", async ({ page }) => {
  await home(page);
  const customer = await loginExisting(page, 'checkout_new_address_user');
  await cartSetup(page, STEP);
  await action(page, 'Proceed to checkout').click();
  await addressesStep(page);
  const addresses = region(page, 'Addresses');
  await action(addresses, 'Add new address').click();
  const address = addressInput(customer, 'Delivery');
  const form = await fillAddress(page, address);
  await action(form, 'Save').click();
  await expect(choice(addresses, 'radio', address.alias)).toBeVisible();
  await expect(addresses).toContainText(address.Address);
  await expect(region(page, 'Order summary')).toContainText(STEP);
});
