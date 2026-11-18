import { expect, type Page, type Locator } from '@playwright/test';
import { createHash } from 'node:crypto';
import { addressInput, catalog, verifiedCustomer, type Address, type Customer, type VerifiedAccount } from './fixtures/data';

export const DETAIL = 'Hummingbird detail t-shirt';
export const CART = 'Hummingbird cart t-shirt';
export const STEP = 'Hummingbird checkout-step t-shirt';
export const WHITE = 'White t-shirt';
export const BLACK = 'Black mug';
export const HISTORY_PRODUCT = 'Hummingbird order-history t-shirt';
export const WISH_PRODUCT = 'Hummingbird wishlist t-shirt';
type Scope = Page | Locator;

const escape = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function exactName(name: string, caseSensitive = false) {
  const count = name === 'Cart' && !caseSensitive ? '(?:\\s+(?:\\d+|\\(\\d+\\)))?' : '';
  return new RegExp('^' + escape(name) + count + '$', caseSensitive ? '' : 'i');
}

export function action(scope: Scope, name: string, caseSensitive = false): Locator {
  const pattern = exactName(name, caseSensitive);
  return scope.getByRole('button', { name: pattern }).or(scope.getByRole('link', { name: pattern }))
    .or(scope.getByRole('menuitem', { name: pattern })).or(scope.getByRole('tab', { name: pattern }))
    .or(scope.locator('a:not([href])[onclick]').filter({ hasText: pattern })).filter({ visible: true });
}

function visibleLeaves(candidates: Locator) {
  const visible = candidates.filter({ visible: true });
  return visible.filter({ hasNot: visible.and(candidates.page().locator('*')) });
}

export function field(scope: Scope, name: string) {
  return scope.getByLabel(name, { exact: true }).or(scope.getByPlaceholder(name, { exact: true }))
    .or(scope.getByRole('textbox', { name, exact: true })).or(scope.getByRole('searchbox', { name, exact: true }))
    .or(scope.getByRole('spinbutton', { name, exact: true })).and(scope.locator('input, textarea')).filter({ visible: true });
}

export function choice(scope: Scope, kind: 'checkbox' | 'radio', name: string) {
  const named = { name, exact: true };
  const native = scope.getByRole(kind, named).or(scope.getByLabel(name, { exact: true }).and(scope.locator(`input[type="${kind}"]`)));
  return (kind === 'checkbox' ? native.or(scope.getByRole('switch', named)) : native).filter({ visible: true });
}

export async function setChoice(control: Locator, checked = true) {
  await expect(control).toHaveCount(1);
  if (await control.isChecked() !== checked) await control.click();
  await expect(control).toBeChecked({ checked });
}

export function inputForm(page: Page, labels: string[], command: string) {
  const complete = (candidates: Locator) => labels.reduce((scope, label) => scope.filter({ has: field(page, label) }), candidates)
    .filter({ has: action(page, command) });
  const forms = complete(page.locator('form')).filter({ visible: true });
  const inline = complete(page.locator(':is(section, div, [role="dialog"]):not(form *)')
    .filter({ hasNot: page.locator('form, nav, header, footer').filter({ visible: true }) }));
  return forms.or(visibleLeaves(inline));
}

export function region(scope: Scope, name: string): Locator {
  if ('page' in scope) return region(scope.page(), name).and(scope.locator('*'));
  const named = { name, exact: true };
  const structural = scope.getByRole('region', named).or(scope.getByRole('group', named))
    .or(scope.getByRole('status', named)).or(scope.getByRole('dialog', named))
    .or(scope.getByRole('alertdialog', named)).or(scope.getByRole('navigation', named))
    .or(scope.getByRole('tabpanel', named)).or(scope.getByRole('form', named));
  const heading = scope.getByRole('heading', named).filter({ visible: true });
  let ordinary = scope.locator('section, article, aside, main, fieldset, form, dialog').filter({ has: heading });
  if (['Sale price', 'Regular price', 'Unit price', 'Subtotal', 'Items subtotal', 'Shipping', 'Shipping cost', 'Total', 'Discount'].includes(name)) {
    const label = scope.locator('dt, th').filter({ hasText: exactName(name, true) });
    ordinary = ordinary.or(label.locator('xpath=following-sibling::*[1][self::dd or self::td]'))
      .or(scope.locator('p, span, li').filter({ hasText: new RegExp('^' + escape(name) + '\\s*:?\\s*(?:USD\\s*|\\$)?\\s*\\d+(?:\\.\\d+)?(?:\\s*USD)?$') }));
  }
  if (name === 'Filters') {
    ordinary = ordinary.or(scope.locator('aside, section, fieldset, form').filter({ has: choice(scope, 'checkbox', 'In stock') })
      .filter({ has: field(scope, 'Minimum price') }));
  }
  if (name === 'Account overview') {
    ordinary = ordinary.or(scope.locator('main, section').filter({ has: action(scope, 'Information') })
      .filter({ has: action(scope, 'Order history and details') }).filter({ has: action(scope, 'Addresses') }));
  }
  if (name === 'Product list') {
    ordinary = ordinary.or(scope.locator('section, main, ul, ol').filter({ has: productEntries(scope) }));
  }
  if (name === 'Search suggestions') {
    ordinary = ordinary.or(scope.getByRole('listbox').filter({ has: scope.getByText(DETAIL, { exact: true }) }));
  }
  if (name === 'Order reference') {
    const label = scope.locator('dt, th').filter({ hasText: /^Order reference$/i });
    ordinary = ordinary.or(label.locator('xpath=following-sibling::*[1][self::dd or self::td]'))
      .or(scope.getByText(/^Order reference\s*:\s*\S+$/i, { exact: true }));
  }
  return structural.filter({ visible: true }).or(visibleLeaves(ordinary)
    .filter({ hasNot: structural }).filter({ hasNot: scope.locator('xpath=ancestor::*').locator(structural).and(scope.locator('xpath=ancestor::*')) }));
}

export function nav(page: Page) {
  return visibleLeaves(page.getByRole('navigation', { name: 'Global navigation', exact: true })
    .or(page.locator('nav, header').filter({ has: action(page, 'Logo') }).filter({ has: action(page, 'Cart') })));
}

export function record(scope: Scope, name: string, kind: 'product' | 'cart' | 'address' | 'wishlist' | 'order'): Locator {
  if ('page' in scope) return record(scope.page(), name, kind).and(scope.locator('*'));
  const named = { name, exact: true };
  const records = scope.locator('article, li, tr, [role="article"], [role="listitem"], [role="row"]')
    .filter({ has: scope.getByText(name, { exact: true }).filter({ visible: true }) });
  const semantic = kind === 'product' ? scope.getByRole('region', { name: 'Product ' + name, exact: true })
    : kind === 'order' || kind === 'cart' ? scope.getByRole('row', named)
      : kind === 'address' ? scope.getByRole('article', named) : scope.getByRole('listitem', named);
  const alternatives = kind === 'address' ? records.filter({ has: action(scope, 'Update').or(action(scope, 'Delete')) }) : records;
  return visibleLeaves(semantic.or(alternatives));
}

export function card(page: Page, name: string) { return record(region(page, 'Product list'), name, 'product'); }
export function count(page: Page) {
  return visibleLeaves(page.getByRole('status', { name: 'Product count', exact: true })
    .or(page.getByText(/^Showing\s+\d+\s*[-\u2013]\s*\d+\s+of\s+\d+(?:\s+item\(s\)|\s+items?)?$/i, { exact: true })));
}
export function cartRow(page: Page, name: string) { return record(page, name, 'cart'); }
export function success(page: Page) { return region(page, 'Product successfully added to your shopping cart'); }
export function addressRecord(page: Page, alias: string) { return record(page, alias, 'address'); }

export function feedback(page: Page, name: string, text: RegExp) {
  const messages = page.getByRole('status').or(page.getByRole('alert')).or(page.locator('[aria-live="polite"], [aria-live="assertive"]'));
  return visibleLeaves(region(page, name).or(messages).filter({ hasText: text }));
}

export async function expectAverageRating(reviews: Locator) {
  await expect(reviews).toContainText(/\bAverage rating(?:\s*:\s*|\s+)4(?:\.0+)?(?=\s|$)/i, { useInnerText: true });
}

export async function expectOrderReference(page: Page) {
  const reference = region(page, 'Order reference');
  await expect(reference).toBeVisible();
  await expect.poll(async () => (await reference.innerText()).replace(/^\s*Order reference\s*:?\s*/i, '').trim()).toMatch(/\S/);
}

export function shippingAddressEdit(page: Page, alias: string) {
  const addresses = region(page, 'Addresses');
  const row = visibleLeaves(page.locator('article, li, tr, fieldset, section')
    .filter({ has: choice(page, 'radio', alias) }).filter({ has: action(page, 'Edit') })
    .and(addresses.locator('*')));
  return action(addresses, 'Edit address ' + alias, true).or(action(row, 'Edit'));
}

export function navigation(page: Page, name: 'Breadcrumb' | 'Pagination') {
  const layouts = page.locator('nav, ol, ul');
  const alternative = name === 'Breadcrumb'
    ? layouts.filter({ has: action(page, 'Home') }).filter({ has: action(page, 'CLOTHES') })
      .filter({ hasNot: action(page, 'Cart') })
    : layouts.filter({ has: action(page, 'Next') }).filter({ hasNot: action(page, 'Cart') });
  return visibleLeaves(region(page, name).or(alternative));
}

export function selectField(scope: Scope, name: string) {
  return scope.getByRole('combobox', { name, exact: true })
    .or(scope.getByLabel(name, { exact: true }).and(scope.locator('select'))).filter({ visible: true });
}

export async function chooseOption(control: Locator, label: string) {
  await expect(control).toHaveCount(1);
  if (await control.evaluate(el => el instanceof HTMLSelectElement)) {
    await control.selectOption({ label });
    await expect(control.getByRole('option', { name: label, exact: true })).toHaveJSProperty('selected', true);
    return;
  }
  await control.click();
  const controlled = await control.getAttribute('aria-controls');
  const page = control.page();
  const list = controlled ? page.locator('[id=' + JSON.stringify(controlled) + ']') : page.getByRole('listbox').filter({ visible: true });
  await list.getByRole('option', { name: label, exact: true }).click();
  if (await control.evaluate(el => el instanceof HTMLInputElement)) await expect(control).toHaveValue(label);
  else await expect(control).toHaveText(label);
}

export async function expectResultCount(page: Page, expected: number) {
  await expect(count(page)).toHaveCount(1);
  await expect.poll(async () => {
    const value = (await count(page).innerText()).trim();
    const range = /^Showing\s+(\d+)\s*[-\u2013]\s*(\d+)\s+of\s+(\d+)(?:\s+item\(s\)|\s+items?)?$/i.exec(value);
    if (!range) return /^\d+(?:\s+(?:items?|products?))?$/i.test(value) ? parseInt(value, 10) : null;
    const [, first, last, total] = range.map(Number);
    return first <= last && last <= total ? total : null;
  }, { message: 'catalog result count agrees with the active filters' }).toBe(expected);
}
export async function home(page: Page) {
  await page.goto('/');
  await expect(nav(page)).toBeVisible();
}
export async function tabTo(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  // Bounded keyboard traversal observes focus through the exposed UI, never DOM tab indices.
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate(el => el === document.activeElement)) return;
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
  await action(card(page, name), name, true).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
export async function slideIdentity(page: Page) {
  const active = region(page, 'Carousel').getByRole('img').filter({ visible: true });
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAccessibleName(/\S/);
  await expect.poll(() => active.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
  return createHash('sha256').update(await active.screenshot({ animations: 'disabled' })).digest('hex');
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
  const products = await listingProducts(page).all();
  expect(products.length).toBeGreaterThan(0);
  return Promise.all(products.map(async product => monetaryValue(await region(product, 'Sale price').innerText())));
}

const knownName = new RegExp('^(?:' + catalog.map(([name]) => escape(name)).join('|') + ')$');

function productEntries(page: Page) {
  const records = page.locator('article, li, tr, [role="listitem"], [role="article"], [role="row"]');
  const opening = page.getByRole('link').or(page.getByRole('button')).or(page.locator('a[onclick]'));
  const title = page.getByText(knownName).filter({ visible: true });
  return visibleLeaves(page.getByRole('region', { name: /^Product (?!list$)/ })
    .or(records.filter({ has: title })).or(records.filter({ has: opening }).filter({ has: page.getByRole('img') })));
}

export function listingProducts(page: Page) {
  return productEntries(page).and(region(page, 'Product list').locator('*'));
}

export async function listingNames(page: Page) {
  const products = await listingProducts(page).all();
  return Promise.all(products.map(async product => {
    const matches = new Set((await product.getByText(knownName).filter({ visible: true }).allTextContents())
      .map(name => name.trim().replace(/\s+/g, ' ')));
    return matches.size === 1 ? [...matches][0] : null;
  }));
}

export async function expectCatalog(page: Page, inStock: boolean, minimum: number) {
  const expected = catalog.filter(([name, price]) => price >= minimum && (!inStock || name !== BLACK)).map(([name]) => name).sort();
  await expectResultCount(page, expected.length);
  await expect.poll(async () => (await listingNames(page)).sort(), { message: 'visible results satisfy every active filter' }).toEqual(expected);
}

export async function verifyCombinedFilters(page: Page, higherMinimum: number) {
  await expectResultCount(page, catalog.length);
  await expect(listingProducts(page)).toHaveCount(12);
  const unfiltered = (await listingNames(page)).sort();
  expect(unfiltered).not.toContain(null);
  expect(new Set(unfiltered).size).toBe(12);
  const filters = region(page, 'Filters');
  const stock = choice(filters, 'checkbox', 'In stock');
  const minimum = field(filters, 'Minimum price');
  const setMinimum = async (value: number) => {
    await minimum.fill(String(value));
    await minimum.blur();
    await expect(minimum).toHaveValue(new RegExp('^' + value + '(?:\\.0+)?$'));
  };
  // At USD 12 each filter has a different witness; a higher minimum alone would hide the out-of-stock product.
  await expect(stock).not.toBeChecked();
  await setMinimum(12);
  await expectCatalog(page, false, 12);
  await setChoice(stock);
  await expectCatalog(page, true, 12);
  await setMinimum(higherMinimum);
  await expect(stock).toBeChecked();
  await expectCatalog(page, true, higherMinimum);
  await expect.poll(async () => (await listingPrices(page)).every(price => price >= higherMinimum)).toBe(true);
  await action(page, 'Clear all').click();
  await expect(stock).not.toBeChecked();
  await expect(minimum).toHaveValue(/^(?:0(?:\.0+)?)?$/);
  await expectResultCount(page, catalog.length);
  await expect.poll(async () => (await listingNames(page)).sort()).toEqual(unfiltered);
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
  const form = inputForm(page, ['Email', 'Password'], 'Sign in');
  await field(form, 'Email').fill(email);
  await field(form, 'Password').fill(password);
  await action(form, 'Sign in').click();
  await expect(action(nav(page), 'My account')).toBeVisible();
}

export async function registerCustomer(page: Page, customer: Customer) {
  await action(nav(page), 'Sign in').click();
  await action(page, 'No account? Create one here').click();
  const values = {
    'First name': customer.firstName, 'Last name': customer.lastName,
    Email: customer.email, Password: customer.password, Birthdate: customer.birthdate,
  };
  const form = inputForm(page, Object.keys(values), 'Save');
  for (const [name, value] of Object.entries(values)) {
    const input = field(form, name);
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }
  await setChoice(choice(form, 'radio', 'Mr.'));
  for (const name of ['Receive offers', 'Newsletter', 'Terms']) await setChoice(choice(form, 'checkbox', name));
  await action(form, 'Save').click();
  await expect(action(nav(page), 'My account')).toBeVisible();
  await expect(nav(page)).toContainText(customer.firstName + ' ' + customer.lastName);
}

export async function loginExisting(page: Page, account: VerifiedAccount) {
  const customer = verifiedCustomer(account);
  await loginEmail(page, customer.email, customer.password);
  return customer;
}

export async function account(page: Page) {
  await action(nav(page), 'My account').click();
  await expect(region(page, 'Account overview')).toBeVisible();
}
export async function fillAddress(page: Page, address: Address) {
  const { alias, Country, ...rest } = address;
  const values = { Alias: alias, ...rest };
  const form = inputForm(page, Object.keys(values), 'Save');
  for (const [name, value] of Object.entries(values)) {
    const input = field(form, name);
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }
  await chooseOption(selectField(form, 'Country'), Country);
  return form;
}
export async function createAddress(page: Page, address: Address) {
  await account(page);
  await action(region(page, 'Account overview'), 'Addresses').click();
  await action(page, 'Create new address').click();
  const form = await fillAddress(page, address);
  await action(form, 'Save').click();
  await expect(addressRecord(page, address.alias)).toBeVisible();
  await expect(addressRecord(page, address.alias)).toContainText(address.Address);
}
export async function addressesStep(page: Page, alias?: string) {
  const addresses = region(page, 'Addresses');
  const addressChoice = alias ? choice(addresses, 'radio', alias) : undefined;
  const add = action(addresses, 'Add new address');
  if (!(await addressChoice?.isVisible()) && !(await add.isVisible())) {
    await action(region(page, 'Personal Information'), 'Continue').click();
  }
  await expect(addresses).toBeVisible();
}
export async function checkoutSetup(page: Page, product: string, account: VerifiedAccount) {
  const customer = await loginExisting(page, account);
  const address = addressInput(customer);
  await createAddress(page, address);
  await cartSetup(page, product);
  await action(page, 'Proceed to checkout').click();
  await addressesStep(page, address.alias);
  return address;
}
export async function shippingStep(page: Page, alias: string) {
  const addresses = region(page, 'Addresses');
  await setChoice(choice(addresses, 'radio', alias));
  await action(addresses, 'Continue').click();
  await expect(region(page, 'Shipping Method')).toBeVisible();
}
export async function paymentStep(page: Page, alias: string) {
  await shippingStep(page, alias);
  const shipping = region(page, 'Shipping Method');
  await setChoice(choice(shipping, 'radio', 'Delivery'));
  await action(shipping, 'Continue').click();
  await expect(region(page, 'Payment')).toBeVisible();
}
export async function placeOrder(page: Page) {
  const payment = region(page, 'Payment');
  await setChoice(choice(payment, 'radio', 'Bank wire'));
  await setChoice(choice(payment, 'checkbox', 'Terms and conditions'));
  await action(payment, 'Place order').click();
}
export async function confirmDeletion(page: Page, control: Locator) {
  const accept = (dialog: import('@playwright/test').Dialog) => dialog.accept();
  page.on('dialog', accept);
  try { await control.click(); } finally { page.off('dialog', accept); }
}
export async function history(page: Page) {
  await loginExisting(page, 'order_history_user'); await account(page);
  await action(region(page, 'Account overview'), 'Order history and details').click();
  await expect(historyRow(page)).toBeVisible();
}
export function historyRow(page: Page) { return record(region(page, 'Order history'), 'PS-HISTORY-001', 'order'); }

export async function expectOnlyHistoryOrder(page: Page) {
  const history = region(page, 'Order history');
  await expect(history).toHaveCount(1);
  const rows = page.locator('tr:has(td), [role="row"]:has([role="cell"], [role="gridcell"])')
    .or(page.getByRole('row').filter({ has: action(page, 'Details') }))
    .and(page.locator(':not(tfoot *)'));
  const card = page.locator('article, li, [role="article"], [role="listitem"]');
  // A card can be an order even without an opening action, but a menu item is not a record.
  const shown = card.filter({ has: page.locator('time').or(page.getByText(/^PS-HISTORY-\d+$/)) });
  const titled = card.filter({ has: page.getByRole('heading') }).filter({ has: action(page, 'Details') });
  const entries = visibleLeaves(rows.or(shown).or(titled)).and(history.locator('*'));
  await expect(entries, 'order history must contain exactly one order').toHaveCount(1);
  await expect(entries.and(historyRow(page))).toHaveCount(1);
}

export function wishlist(page: Page, name: string) { return record(page, name, 'wishlist'); }
export function wishlistProduct(page: Page) { return wishlist(page, WISH_PRODUCT); }
export function wishlistOpening(page: Page, name: string) {
  const collection = wishlist(page, name);
  return action(collection, name, true).or(action(collection, 'Open'));
}
export async function wishlistPage(page: Page, existing: Extract<VerifiedAccount, `wishlist_${string}`>) {
  await loginExisting(page, existing);
  await account(page);
  await action(region(page, 'Account overview'), 'Wishlist').click();
  await expect(action(page, 'Create new wishlist')).toBeVisible();
}
export async function createWishlist(page: Page, name: string) {
  await action(page, 'Create new wishlist').click();
  const dialog = inputForm(page, ['Name'], 'Save');
  await field(dialog, 'Name').fill(name); await action(dialog, 'Save').click();
  await expect(dialog).toBeHidden();
  await expect(wishlist(page, name)).toHaveCount(1);
  await expect(wishlist(page, name)).toBeVisible();
}
