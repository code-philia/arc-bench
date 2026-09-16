
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
    searchKeyword: 'skirt',
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
    cart461: { name: 'Hummingbird cart 4.6.1 t-shirt' },
    cart462: { name: 'Hummingbird cart 4.6.2 t-shirt' },
    cart463: { name: 'Hummingbird cart 4.6.3 t-shirt' },
    cart51: { name: 'Hummingbird cart 5.1 t-shirt' },
    cart52: { name: 'Hummingbird cart 5.2 t-shirt' },
    cart53: { name: 'Hummingbird cart 5.3 t-shirt' },
    cart54: { name: 'Hummingbird cart 5.4 t-shirt' },
    cart55: { name: 'Hummingbird cart 5.5 t-shirt' },
    cart56: { name: 'Hummingbird cart 5.6 t-shirt' },
    cart57: { name: 'Hummingbird cart 5.7 t-shirt' },
    checkout61: { name: 'Hummingbird checkout 6.1 t-shirt' },
    checkout62: { name: 'Hummingbird checkout 6.2 t-shirt' },
    checkout631: { name: 'Hummingbird checkout 6.3.1 t-shirt' },
    checkout632: { name: 'Hummingbird checkout 6.3.2 t-shirt' },
    checkout633: { name: 'Hummingbird checkout 6.3.3 t-shirt' },
    checkout64: { name: 'Hummingbird checkout 6.4 t-shirt' },
    checkout65: { name: 'Hummingbird checkout 6.5 t-shirt' },
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
    checkoutInvoiceAddress: { email: 'prestashop_checkout_invoice_address_user@example.com', password: 'ShopPass123!' },
    checkoutShipping: { email: 'prestashop_checkout_shipping_user@example.com', password: 'ShopPass123!' },
    checkoutPayment: { email: 'prestashop_checkout_payment_user@example.com', password: 'ShopPass123!' },
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
    t.getByRole('alert', { name: pattern }),
    t.getByRole('region', { name: pattern }),
    t.getByRole('contentinfo', { name: pattern }),
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

export async function expectHome(page: Page): Promise<void> {
  await expectTextsVisible(page, [/search/i, /sign in/i, /cart/i]);
}

export async function expectCartCount(page: Page): Promise<void> {
  const cart = page.getByRole('link', { name: /^Shopping cart$/i });
  await expect(cart).toBeVisible();
  await expect(cart).toContainText(/\d+/);
}

export async function carousel(page: Page): Promise<Locator> {
  return page.getByRole('region', { name: /^Carousel$/i });
}

export async function expectCarouselToChange(page: Page, action?: () => Promise<void>): Promise<void> {
  const targetCarousel = await carousel(page);
  await expect(targetCarousel).toBeVisible();
  const before = await targetCarousel.screenshot();
  if (action) await action();
  await expect.poll(async () => {
    const after = await targetCarousel.screenshot();
    return !after.equals(before);
  }, { timeout: 7_000, intervals: [250, 500, 1_000] }).toBe(true);
}

export async function openCategoryMenu(page: Page): Promise<void> {
  const navigation = page.getByRole('navigation', { name: /^Main navigation$/i });
  await navigation.getByRole('button', { name: /^Clothes$/i }).hover();
}

export async function openCategoryPage(page: Page): Promise<void> {
  await openHome(page);
  await openCategoryMenu(page);
  const navigation = page.getByRole('navigation', { name: /^Main navigation$/i });
  await navigation.getByRole('link', { name: /^Men$/i }).click();
}

export async function openSearchResults(page: Page): Promise<void> {
  await openHome(page);
  const search = page.getByRole('textbox', { name: /^Search$/i });
  await search.click();
  await search.fill(FIXTURES.catalog.searchKeyword);
  await search.press('Enter');
}

export async function openProductDetail(page: Page, product: ProductFixture): Promise<void> {
  await openHome(page);
  const search = page.getByRole('textbox', { name: /^Search$/i });
  await search.fill(product.name);
  await search.press('Enter');
  await page.getByRole('main').getByRole('link', { name: new RegExp(`^${escapeRegExp(product.name)}$`, 'i') }).click();
}

export async function ensureWishlistPrompt(page: Page): Promise<void> {
  await expectTextsVisible(page, [/wishlist/i, /sign in/i, /login/i]);
}

export async function openCart(page: Page): Promise<void> {
  await page.getByRole('link', { name: /^Shopping cart$/i }).click();
}

export async function openSignIn(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /^Sign in$/i);
}

export async function login(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openSignIn(page);
  await page.getByLabel('Email address *', { exact: true }).fill(account.email);
  await page.getByLabel('Password *', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: /^SIGN IN$/i }).click();
}

export async function openMyAccount(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await login(page, account);
  await page.getByRole('link', { name: /^My account$/i }).first().click();
}

export async function openAddressBook(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
  await page.getByRole('link', { name: /^Addresses$/i }).first().click();
}

export async function openOrderHistory(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
  await clickNamed(page, /^Order history and details$/i);
}

export async function openWishlists(page: Page, account: AccountFixture = FIXTURES.accounts.login): Promise<void> {
  await openMyAccount(page, account);
  await clickNamed(page, /^Wishlists?$/i);
}

export async function setProductQuantity(page: Page, quantity: string): Promise<void> {
  await page.getByRole('spinbutton', { name: /^Quantity$/i }).fill(quantity);
}

export async function addProductToCart(page: Page): Promise<void> {
  await clickNamed(page, /^ADD TO CART$/i);
}

export async function openCartWithProduct(page: Page, product: ProductFixture): Promise<void> {
  await openProductDetail(page, product);
  await addProductToCart(page);
  await clickNamed(page, /^Proceed to checkout$/i);
  await expect(page.getByRole('heading', { name: /^Shopping cart$/i })).toBeVisible();
}

export async function startCheckoutWithProduct(page: Page, product: ProductFixture): Promise<void> {
  await openCartWithProduct(page, product);
  await clickNamed(page, /^Proceed to checkout$/i);
  await expect(page.getByRole('heading', { name: /^Personal information$/i })).toBeVisible();
}

export async function awaitDownload(action: () => Promise<void>, page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download');
  await action();
  return downloadPromise;
}
