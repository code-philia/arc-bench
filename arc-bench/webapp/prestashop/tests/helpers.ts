
import { Download, expect, Locator, Page } from '@playwright/test';

type Scope = Page | Locator;
type Match = string | RegExp | Array<string | RegExp>;

export type ProductFixture = {
  name: string;
  size?: string;
  color?: string;
  quantity?: string;
  excessiveQuantity?: string;
};

export type AccountFixture = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export const FIXTURES = {
  catalog: {
    topCategory: 'CLOTHES',
    subcategory: 'Men',
    secondarySubcategory: 'Women',
    searchKeyword: 'shirt',
    popularProduct: 'Hummingbird detail t-shirt',
    alternativeProduct: 'The best is yet to come notebook',
    whiteProduct: 'White t-shirt',
    blackProduct: 'Black mug',
  },
  products: {
    detail: {
      name: 'Hummingbird detail t-shirt',
      size: 'M',
      color: 'White',
      quantity: '3',
      excessiveQuantity: '999',
    },
    cart: {
      name: 'Hummingbird cart t-shirt',
    },
    checkoutStep: {
      name: 'Hummingbird checkout-step t-shirt',
    },
    orderConfirmation: {
      name: 'Hummingbird order-confirmation t-shirt',
    },
    orderComplete: {
      name: 'Hummingbird order-complete t-shirt',
    },
    orderHistory: {
      name: 'Hummingbird order-history t-shirt',
    },
    wishlist: {
      name: 'Hummingbird wishlist t-shirt',
    },
  },
  accounts: {
    login: {
      firstName: 'Store',
      lastName: 'User',
      email: 'prestashop_user@example.com',
      password: 'ShopPass123!',
    },
    profile: {
      email: 'prestashop_profile_user@example.com',
      password: 'ShopPass123!',
      newEmail: 'prestashop_profile_user_next@example.com',
      newPassword: 'ShopPass456!',
    },
    checkoutInformation: {
      email: 'prestashop_checkout_user@example.com',
      password: 'ShopPass123!',
    },
    checkoutExistingAddress: {
      email: 'prestashop_checkout_address_user@example.com',
      password: 'ShopPass123!',
    },
    checkoutNewAddress: {
      email: 'prestashop_checkout_new_address_user@example.com',
      password: 'ShopPass123!',
    },
    checkoutInvoice: {
      email: 'prestashop_checkout_invoice_user@example.com',
      password: 'ShopPass123!',
    },
    checkoutOrderConfirmation: {
      email: 'prestashop_checkout_6_6_user@example.com',
      password: 'ShopPass123!',
    },
    checkoutOrderComplete: {
      email: 'prestashop_checkout_6_7_user@example.com',
      password: 'ShopPass123!',
    },
    addressView: {
      email: 'prestashop_address_view_user@example.com',
      password: 'ShopPass123!',
    },
    addressCreate: {
      email: 'prestashop_address_create_user@example.com',
      password: 'ShopPass123!',
    },
    addressEdit: {
      email: 'prestashop_address_edit_user@example.com',
      password: 'ShopPass123!',
    },
    addressDelete: {
      email: 'prestashop_address_delete_user@example.com',
      password: 'ShopPass123!',
    },
    orderHistory: {
      email: 'prestashop_order_history_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistView: {
      email: 'prestashop_wishlist_view_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistCreate: {
      email: 'prestashop_wishlist_create_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistRename: {
      email: 'prestashop_wishlist_rename_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistDelete: {
      email: 'prestashop_wishlist_delete_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistRemove: {
      email: 'prestashop_wishlist_remove_user@example.com',
      password: 'ShopPass123!',
    },
    wishlistCart: {
      email: 'prestashop_wishlist_cart_user@example.com',
      password: 'ShopPass123!',
    },
  },
  address: {
    alias: 'Home',
    newAlias: 'Office',
    firstName: 'Store',
    lastName: 'User',
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

export async function openProductDetail(page: Page, product: ProductFixture): Promise<void> {
  await openCategoryPage(page);
  await clickFirstAvailable(page, [[product.name]]);
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

export async function login(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openSignIn(page);
  await fillField(page, [/email/i], account.email);
  await fillField(page, [/password/i], account.password);
  await clickFirstAvailable(page, [[/sign in/i]]);
}

export async function openMyAccount(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await login(page, account);
  const accountEntry: Match[] = [/my account/i];
  if (account.firstName) accountEntry.push(new RegExp(account.firstName, 'i'));
  await clickFirstAvailable(page, accountEntry);
}

export async function openAddressBook(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
  await clickFirstAvailable(page, [[/addresses/i]]);
}

export async function openOrderHistory(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
  await clickFirstAvailable(page, [[/order history and details/i, /orders/i]]);
}

export async function openWishlists(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
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
