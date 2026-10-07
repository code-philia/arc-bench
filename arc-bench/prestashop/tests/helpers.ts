import { expect, type Page, type Locator } from '@playwright/test';

export const DETAIL = 'Hummingbird detail t-shirt';
export const CART = 'Hummingbird cart t-shirt';
export const STEP = 'Hummingbird checkout-step t-shirt';
export const WHITE = 'White t-shirt';
export const BLACK = 'Black mug';
export const HISTORY_PRODUCT = 'Hummingbird order-history t-shirt';
export const WISH_PRODUCT = 'Hummingbird wishlist t-shirt';
type Scope = Page | Locator;

function exactName(name: string) {
  return new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
}
// Links and buttons are interchangeable for navigation actions; neither layout nor tag order is assumed.
export function action(scope: Scope, name: string): Locator {
  return scope.getByRole('button', { name: exactName(name) }).or(scope.getByRole('link', { name: exactName(name) }));
}
export function region(scope: Scope, name: string) { return scope.getByRole('region', { name, exact: true }); }
export function nav(page: Page) { return page.getByRole('navigation', { name: 'Global navigation', exact: true }); }
export function card(page: Page, name: string) { return region(region(page, 'Product list'), `Product ${name}`); }
export function count(page: Page) { return page.getByRole('status', { name: 'Product count', exact: true }); }
export function cartRow(page: Page, name: string) { return page.getByRole('row', { name, exact: true }); }
export function success(page: Page) { return page.getByRole('dialog', { name: 'Product successfully added to your shopping cart', exact: true }); }
export async function home(page: Page) {
  await page.goto('/');
  await expect(nav(page)).toBeVisible();
}
export async function tabTo(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  // Bounded keyboard traversal observes focus through the exposed UI, never DOM tab indices.
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press('Tab');
    try { await expect(target).toBeFocused({ timeout: 20 }); return; } catch { /* try next focusable control */ }
  }
  await expect(target).toBeFocused();
}
export async function men(page: Page) {
  await action(nav(page), 'CLOTHES').hover();
  await action(nav(page), 'Men').click();
  await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible();
  await expect(card(page, DETAIL)).toBeVisible();
}
export async function openProduct(page: Page, name: string) {
  await men(page);
  await action(card(page, name), name).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
export async function slideIdentity(page: Page) {
  // Lightweight identity only: no pixel comparison, asset download, or visual-content analysis.
  const active = region(page, 'Carousel').getByRole('img').filter({ visible: true });
  await expect(active).toHaveCount(1);
  await expect(active).toBeVisible();
  return { name: await active.getAttribute('aria-label') ?? await active.getAttribute('alt'), source: await active.getAttribute('src') };
}
export function monetaryValue(text: string): number {
  const numbers = text.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length !== 1) throw new Error(`Expected one monetary amount, received ${JSON.stringify(text)}`);
  return Number(numbers[0]);
}
export async function expectMoney(scope: Locator, amount: number) {
  await expect(scope).toBeVisible();
  await expect.poll(async () => monetaryValue(await scope.innerText())).toBeCloseTo(amount, 2);
}
export async function listingPrices(page: Page) {
  const prices = region(page, 'Product list').getByRole('region', { name: 'Sale price', exact: true });
  const texts = await prices.allTextContents();
  if (!texts.length) throw new Error('Product list contains no visible prices');
  return texts.map(monetaryValue);
}
export async function addProduct(page: Page, name: string) {
  await openProduct(page, name);
  await action(page, 'Add to cart').click();
  await expect(success(page)).toBeVisible();
  await expect(success(page)).toContainText(name);
}
export async function cartSetup(page: Page, name: string) {
  await addProduct(page, name);
  await action(success(page), 'Proceed to checkout').click();
  await expect(cartRow(page, name)).toBeVisible();
}
export async function loginEmail(page: Page, email: string, password: string) {
  await action(nav(page), 'Sign in').click();
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await expect(action(nav(page), 'My account')).toBeVisible();
}
export async function login(page: Page, accountName: string) {
  await loginEmail(page, `prestashop_${accountName}@example.com`, 'ShopPass123!');
}
export async function account(page: Page) {
  await action(nav(page), 'My account').click();
  await expect(region(page, 'Account overview')).toBeVisible();
}
export async function fillAddress(page: Page, alias: string) {
  const values: Record<string, string> = { Alias: alias, 'First name': 'Store', 'Last name': 'User', Address: '1 Commerce Road', 'Postal code': '200000', City: 'Shanghai', Phone: '13800000020' };
  for (const [name, value] of Object.entries(values)) {
    const field = page.getByLabel(name, { exact: true });
    await expect(field).toBeVisible(); await field.fill(value); await expect(field).toHaveValue(value);
  }
  const country = page.getByRole('combobox', { name: 'Country', exact: true });
  await country.selectOption({ label: 'China' });
  // Native selected-option semantics, independent of implementation-specific option values.
  await expect(country.getByRole('option', { name: 'China', exact: true })).toHaveJSProperty('selected', true);
}
export async function createAddress(page: Page, alias: string) {
  await account(page);
  await action(region(page, 'Account overview'), 'Addresses').click();
  await action(page, 'Create new address').click();
  await fillAddress(page, alias); await action(page, 'Save').click();
  await expect(page.getByRole('article', { name: alias, exact: true })).toBeVisible();
}
export async function addressesStep(page: Page) {
  const addresses = region(page, 'Addresses');
  const homeChoice = addresses.getByRole('radio', { name: 'Home', exact: true });
  const add = action(addresses, 'Add new address');
  if (!(await homeChoice.isVisible()) && !(await add.isVisible())) {
    await action(region(page, 'Personal Information'), 'Continue').click();
  }
  await expect(addresses).toBeVisible();
}
export async function checkoutSetup(page: Page, accountName: string, product: string) {
  await login(page, accountName);
  await createAddress(page, 'Home');
  await cartSetup(page, product);
  await action(page, 'Proceed to checkout').click();
  await addressesStep(page);
}
export async function shippingStep(page: Page) {
  const addresses = region(page, 'Addresses');
  await addresses.getByRole('radio', { name: 'Home', exact: true }).check();
  await action(addresses, 'Continue').click();
  await expect(region(page, 'Shipping Method')).toBeVisible();
}
export async function paymentStep(page: Page) {
  await shippingStep(page);
  const shipping = region(page, 'Shipping Method');
  await shipping.getByRole('radio', { name: 'Delivery', exact: true }).check();
  await action(shipping, 'Continue').click();
  await expect(region(page, 'Payment')).toBeVisible();
}
export async function placeOrder(page: Page) {
  const payment = region(page, 'Payment');
  await payment.getByRole('radio', { name: 'Bank wire', exact: true }).check();
  await payment.getByRole('checkbox', { name: 'Terms and conditions', exact: true }).check();
  await action(payment, 'Place order').click();
}
export async function confirmDeletion(page: Page, control: Locator) {
  const accept = (dialog: import('@playwright/test').Dialog) => dialog.accept();
  page.on('dialog', accept);
  try { await control.click(); } finally { page.off('dialog', accept); }
}
export async function history(page: Page) {
  await login(page, 'order_history_user'); await account(page);
  await action(region(page, 'Account overview'), 'Order history and details').click();
  await expect(historyRow(page)).toBeVisible();
}
export function historyRow(page: Page) { return region(page, 'Order history').getByRole('row', { name: 'PS-HISTORY-001', exact: true }); }
export function wishlist(page: Page, name: string) { return page.getByRole('listitem', { name, exact: true }); }
export function wishlistProduct(page: Page) { return page.getByRole('listitem', { name: WISH_PRODUCT, exact: true }); }
export async function wishlistPage(page: Page, accountName: string) {
  await login(page, accountName); await account(page); await action(region(page, 'Account overview'), 'Wishlist').click();
  await expect(action(page, 'Create new wishlist')).toBeVisible();
}
export async function createWishlist(page: Page, name: string) {
  await action(page, 'Create new wishlist').click();
  const dialog = page.getByRole('dialog', { name: 'Create new wishlist', exact: true });
  await dialog.getByLabel('Name', { exact: true }).fill(name); await action(dialog, 'Save').click();
  await expect(wishlist(page, name)).toBeVisible();
}
