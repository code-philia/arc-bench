// requirement: REQ-2.3
import { test, expect } from '@playwright/test';
import { home, action, region, men, field, choice, setChoice, expectCatalog, expectResultCount, listingNames, listingProducts, listingPrices } from './helpers';
import { catalog, storefrontInput } from './fixtures/data';

test("REQ-2.3: Filter in-stock products", async ({ page }) => {
  await home(page);
  await men(page);
  await setChoice(choice(region(page, 'Filters'), 'checkbox', 'In stock'));
  await expectCatalog(page, true, 0);
});

test("REQ-2.3: Filter White color", async ({ page }) => {
  await home(page);
  await men(page);
  await setChoice(choice(region(page, 'Filters'), 'checkbox', 'White'));
  const expected = catalog.filter(([, , color]) => color === 'White').map(([name]) => name).sort();
  await expectResultCount(page, expected.length);
  await expect.poll(async () => (await listingNames(page)).sort()).toEqual(expected);
});

test("REQ-2.3: Filter minimum price", async ({ page }) => {
  const input = storefrontInput();
  await home(page);
  await men(page);
  const minimum = field(region(page, 'Filters'), 'Minimum price');
  await minimum.fill(String(input.minimum));
  await minimum.blur();
  await expectCatalog(page, false, input.minimum);
  await expect.poll(async () => (await listingPrices(page)).every(price => price >= input.minimum)).toBe(true);
});

test("REQ-2.3: Clear applied filters", async ({ page }) => {
  await home(page);
  await men(page);
  await expectResultCount(page, catalog.length);
  await expect(listingProducts(page)).toHaveCount(12);
  const original = (await listingNames(page)).sort();
  expect(original).not.toContain(null);
  expect(new Set(original).size).toBe(12);
  const stock = choice(region(page, 'Filters'), 'checkbox', 'In stock');
  await setChoice(stock);
  await expectCatalog(page, true, 0);
  await action(page, 'Clear all').click();
  await expect(stock).not.toBeChecked();
  await expectResultCount(page, catalog.length);
  await expect.poll(async () => (await listingNames(page)).sort()).toEqual(original);
});
