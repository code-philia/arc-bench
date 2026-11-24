// requirement: REQ-5.1
import { test, expect } from '@playwright/test';
import { home, action, region, cartSetup, loginExisting, createAddress, addressesStep, choice, STEP } from './helpers';
import { addressInput } from './fixtures/data';

test("REQ-5.1: Start anonymous checkout", async ({ page }) => {
  await home(page);
  await cartSetup(page, STEP);
  await action(page, 'Proceed to checkout').click();
  await expect(region(page, 'Personal Information')).toBeVisible();
  await expect(region(page, 'Order summary')).toContainText(STEP);
});

test("REQ-5.1: Inspect signed-in customer", async ({ page }) => {
  await home(page);
  const customer = await loginExisting(page, 'checkout_user');
  const address = addressInput(customer);
  await createAddress(page, address);
  await cartSetup(page, STEP);
  await action(page, 'Proceed to checkout').click();
  await expect(region(page, 'Personal Information')).toContainText(customer.email);
  await addressesStep(page, address.alias);
  await expect(choice(region(page, 'Addresses'), 'radio', address.alias)).toBeVisible();
  await expect(region(page, 'Order summary')).toContainText(STEP);
});
