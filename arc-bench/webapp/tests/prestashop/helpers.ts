
import { Download, expect, Locator, Page } from '@playwright/test';

type Scope = Page | Locator;
type Match = string | RegExp | Array<string | RegExp>;

export const FIXTURES = {
  catalog: {
    topCategory: 'CLOTHES',
    subcategory: 'Men',
    secondarySubcategory: 'Women',
    searchKeyword: 'shirt',
    popularProduct: 'Hummingbird printed t-shirt',
    alternativeProduct: 'The best is yet to come notebook',
    whiteProduct: 'White t-shirt',
    blackProduct: 'Black mug',
  },
  product: {
    name: 'Hummingbird printed t-shirt',
    size: 'M',
    color: 'White',
    reviewTitle: 'Stylish and comfortable',
    reviewContent: 'The fit is good and the fabric feels comfortable.',
    quantity: '3',
    excessiveQuantity: '999',
  },
  account: {
    firstName: 'Store',
    lastName: 'User',
    email: 'prestashop_user@example.com',
    password: 'ShopPass123!',
    newEmail: 'prestashop_user_next@example.com',
    newPassword: 'ShopPass456!',
    birthdate: '1995-08-21',
  },
  address: {
    alias: 'Home',
    newAlias: 'Office',
    address1: '1 Commerce Road',
    updatedAddress1: '88 Market Street',
    postalCode: '200000',
    city: 'Shanghai',
    country: 'China',
    phone: '13800000020',
  },
  wishlist: {
    name: 'Favorites',
    renamed: 'Holiday Picks',
  },
} as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPatterns(value: Match): RegExp[] {
  const items = Array.isArray(value) ? value : [value];
  return items.map((item) => item instanceof RegExp ? item : new RegExp(escapeRegExp(item).replace(/\s+/g, '\\s+'), 'i'));
}

function target(scope: Scope): any {
  return scope as any;
}

async function firstVisible(locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.isVisible({ timeout: 500 })) return candidate;
    } catch {
      // continue
    }
  }
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.count()) return candidate;
    } catch {
      // continue
    }
  }
  return locators[0].first();
}

function namedLocators(scope: Scope, pattern: RegExp): Locator[] {
  const t = target(scope);
  return [
    t.getByRole('button', { name: pattern }),
    t.getByRole('link', { name: pattern }),
    t.getByRole('menuitem', { name: pattern }),
    t.getByRole('tab', { name: pattern }),
    t.getByRole('checkbox', { name: pattern }),
    t.getByRole('radio', { name: pattern }),
    t.getByRole('option', { name: pattern }),
    t.getByRole('heading', { name: pattern }),
    t.getByLabel(pattern),
    t.getByPlaceholder(pattern),
    t.getByText(pattern),
  ];
}

async function resolveNamed(scope: Scope, value: Match): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible(namedLocators(scope, pattern));
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible(namedLocators(scope, patterns[0]));
}

async function resolveField(scope: Scope, value: Match): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible([
      target(scope).getByLabel(pattern),
      target(scope).getByPlaceholder(pattern),
      target(scope).getByRole('textbox', { name: pattern }),
      target(scope).getByRole('searchbox', { name: pattern }),
      target(scope).getByRole('combobox', { name: pattern }),
      target(scope).getByRole('spinbutton', { name: pattern }),
    ]);
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible([
    target(scope).getByRole('textbox'),
    target(scope).locator('textarea'),
    target(scope).getByRole('spinbutton'),
  ]);
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function clickNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.click();
}

export async function clickFirstAvailable(scope: Scope, values: Match[]): Promise<void> {
  for (const value of values) {
    try {
      const locator = await resolveNamed(scope, value);
      if (await locator.isVisible({ timeout: 200 })) {
        await locator.click();
        return;
      }
    } catch {
      // continue
    }
  }
  await clickNamed(scope, values[0]);
}

export async function hoverNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.hover();
}

export async function expectVisible(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await expect(locator).toBeVisible();
}

export async function expectTextsVisible(scope: Scope, values: Array<string | RegExp>): Promise<void> {
  for (const value of values) {
    await expectVisible(scope, value);
  }
}

export async function expectTextAbsent(scope: Scope, value: Match): Promise<void> {
  const patterns = toPatterns(value);
  await expect(target(scope).getByText(patterns[0])).toHaveCount(0);
}

export async function fillField(scope: Scope, labelOrPlaceholder: Match, value: string): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.fill(value);
}

export async function pressEnter(scope: Scope, labelOrPlaceholder: Match): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.press('Enter');
}

export async function setCheckbox(scope: Scope, value: Match, checked: boolean): Promise<void> {
  const locator = await resolveNamed(scope, value);
  try {
    if (checked) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  } catch {
    await locator.click();
  }
}

export async function setRadio(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  try {
    await locator.check();
  } catch {
    await locator.click();
  }
}

export async function chooseOption(scope: Scope, field: Match, option: Match): Promise<void> {
  const locator = await resolveField(scope, field);
  try {
    const direct = Array.isArray(option) ? option.find((item) => typeof item === 'string') : option;
    if (typeof direct === 'string') {
      await locator.selectOption({ label: direct });
      return;
    }
  } catch {
    // continue
  }
  await locator.click();
  await clickNamed(scope, option);
}

export async function expectFieldValue(scope: Scope, field: Match, expected: Match): Promise<void> {
  const locator = await resolveField(scope, field);
  const value = await locator.inputValue();
  const patterns = toPatterns(expected);
  if (!patterns.some((pattern) => pattern.test(value))) {
    throw new Error(`Expected value to match ${patterns.map((item) => item.source).join(', ')}, got ${value}`);
  }
}

export async function expectUrlIncludes(page: Page, pattern: RegExp): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

export async function expectHome(page: Page): Promise<void> {
  await expectTextsVisible(page, [/search/i, /sign in/i, /cart/i]);
}

export async function openCategoryMenu(page: Page): Promise<void> {
  await hoverNamed(page, [FIXTURES.catalog.topCategory, /clothes/i]);
}

export async function openCategoryPage(page: Page): Promise<void> {
  await openHome(page);
  await openCategoryMenu(page);
  await clickFirstAvailable(page, [[FIXTURES.catalog.subcategory]]);
}

export async function openSearchResults(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/search/i]]);
  await fillField(page, [/search/i], FIXTURES.catalog.searchKeyword);
  await pressEnter(page, [/search/i]);
}

export async function productCard(page: Page, name: string): Promise<Locator> {
  const pattern = new RegExp(escapeRegExp(name), 'i');
  for (const locator of [
    page.getByRole('article').filter({ has: page.getByText(pattern) }),
    page.getByRole('listitem').filter({ has: page.getByText(pattern) }),
    page.locator('main').locator('div').filter({ has: page.getByText(pattern) }),
  ]) {
    const candidate = locator.first();
    try {
      if (await candidate.isVisible({ timeout: 300 })) return candidate;
    } catch {
      // continue
    }
  }
  return page.getByText(pattern).first();
}

export async function openDefaultProductDetail(page: Page): Promise<void> {
  await openCategoryPage(page);
  await clickFirstAvailable(page, [[FIXTURES.product.name]]);
}

export async function ensureWishlistPrompt(page: Page): Promise<void> {
  await expectTextsVisible(page, [/wishlist/i, /sign in/i, /login/i]);
}

export async function openCart(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/cart/i, /shopping cart/i]]);
}

export async function openSignIn(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/sign in/i, /login/i]]);
}

export async function login(page: Page): Promise<void> {
  await openSignIn(page);
  await fillField(page, [/email/i], FIXTURES.account.email);
  await fillField(page, [/password/i], FIXTURES.account.password);
  await clickFirstAvailable(page, [[/sign in/i]]);
}

export async function openMyAccount(page: Page): Promise<void> {
  await login(page);
  await clickFirstAvailable(page, [[/my account/i, new RegExp(FIXTURES.account.firstName, 'i')]]);
}

export async function openAddressBook(page: Page): Promise<void> {
  await openMyAccount(page);
  await clickFirstAvailable(page, [[/addresses/i]]);
}

export async function openOrderHistory(page: Page): Promise<void> {
  await openMyAccount(page);
  await clickFirstAvailable(page, [[/order history and details/i, /orders/i]]);
}

export async function openWishlists(page: Page): Promise<void> {
  await openMyAccount(page);
  await clickFirstAvailable(page, [[/wishlist/i]]);
}

export async function setProductQuantity(page: Page, quantity: string): Promise<void> {
  await fillField(page, [/quantity/i], quantity);
}

export async function addProductToCart(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/add to cart/i]]);
}

export async function awaitDownload(action: () => Promise<void>, page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download');
  await action();
  return downloadPromise;
}
