import { expect, type Locator, type Page } from '@playwright/test';

type Scope = Page | Locator;
const pageOf = (scope: Scope) => 'page' in scope ? scope.page() : scope;
const exact = (name: string | RegExp) => ({ name, exact: true });
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const action = (scope: Scope, name: string | RegExp) => {
  const label = name === 'Add return' ? /^(?:\+\s*)?Add return$/ : name;
  const summaryText = typeof label === 'string' ? new RegExp(`^${escape(label)}$`) : label;
  return scope.getByRole('button', exact(label)).or(scope.getByRole('link', exact(label)))
    .or(scope.getByRole('menuitem', exact(label)))
    .or(scope.locator('details > summary').filter({ hasText: summaryText }));
};

export const field = (scope: Scope, name: string) =>
  scope.getByLabel(name, { exact: true }).and(scope.locator('input:not([type="radio"], [type="checkbox"], [type="hidden"], [type="button"], [type="submit"], [type="reset"]), textarea, select, [contenteditable], [role="combobox"]'))
    .or(scope.getByRole('textbox', exact(name))).or(scope.getByRole('combobox', exact(name)))
    .or(scope.getByRole('searchbox', exact(name)));

export const checkbox = (scope: Scope, name: string) => scope.getByRole('checkbox', exact(name));
export const radio = (scope: Scope, name: string) => scope.getByRole('radio', exact(name));

export async function setChecked(control: Locator, checked = true) {
  await expect(control).toBeVisible();
  if (await control.evaluate(element => element.matches('input[type="checkbox"], input[type="radio"]'))) {
    await control.setChecked(checked);
  } else {
    const state = await control.getAttribute('aria-checked');
    if (state !== 'true' && state !== 'false' && state !== 'mixed') {
      throw new Error('The selection control does not expose a readable state');
    }
    if (state !== String(checked)) await control.click();
    await expect(control).toHaveAttribute('aria-checked', String(checked));
  }
  if (checked) await expect(control).toBeChecked();
  else await expect(control).not.toBeChecked();
}

export async function expectFieldValue(control: Locator, value: string | RegExp) {
  await expect(control).toBeVisible();
  if (await control.evaluate(element => element instanceof HTMLElement && element.isContentEditable)) {
    await expect(control).toHaveText(value);
  } else {
    await expect(control).toHaveValue(value);
  }
}

const titledContainer = 'section, article, fieldset, form, dialog, [role="dialog"], [role="tabpanel"], details';
export const region = (scope: Scope, name: string) => {
  const page = pageOf(scope);
  const title = page.getByRole('heading', exact(name))
    .or(page.locator('legend').and(page.getByText(name, { exact: true })));
  return scope.getByRole('region', exact(name)).or(scope.getByRole('group', exact(name)))
    .or(scope.getByRole('form', exact(name))).or(scope.getByRole('dialog', exact(name)))
    .or(scope.getByRole('list', exact(name)))
    .or(scope.getByRole('table', exact(name)))
    .or(scope.locator(`div[aria-label=${JSON.stringify(name)}]`))
    .or(scope.locator(titledContainer).filter({
      has: title,
      hasNot: page.locator(titledContainer).filter({ has: title }),
    }));
};

const recordSelector = 'tr:has(td), [role="row"]:has([role="cell"], [role="gridcell"]), li, [role="listitem"], article, [role="article"]';
const emptyLabel = /^(?:No (?:flights|travelers|contacts|addresses|invoice titles) found|No (?:orders|vouchers) available|No orders)$/;

export function records(scope: Scope) {
  const named = scope.getByRole('listitem', { name: /^Record / })
    .or(scope.getByRole('row', { name: /^Record / })).or(scope.getByRole('group', { name: /^Record / }));
  // Plain rows, list items and cards also count. Ignore groups that only wrap multiple records.
  const plain = scope.locator(recordSelector).filter({ hasNot: pageOf(scope).locator(recordSelector) })
    .filter({ hasNotText: emptyLabel });
  return named.or(plain).filter({ visible: true });
}

export function record(scope: Scope, name: string) {
  const legacy = scope.getByRole('listitem', exact(`Record ${name}`))
    .or(scope.getByRole('row', exact(`Record ${name}`))).or(scope.getByRole('group', exact(`Record ${name}`)));
  return legacy.or(records(scope).filter({ has: pageOf(scope).getByText(name, { exact: true }) }))
    .or(scope.getByRole('group', exact(name))).filter({ visible: true });
}

const flightNumber = /^[A-Z0-9]{2}\d{3,4}$/;
export function flights(scope: Scope) {
  return scope.getByRole('listitem', { name: /^Flight [A-Z0-9]{2}\d{3,4}$/ })
    .or(records(scope).filter({
      has: pageOf(scope).getByText(flightNumber).or(action(pageOf(scope), 'Show fares')),
    })).filter({ visible: true });
}

export async function flightIdentity(row: Locator): Promise<string> {
  const named = (await row.ariaSnapshot()).split('\n')[0].match(/"Flight ([A-Z0-9]{2}\d{3,4})"/);
  if (named) return named[1];
  const numbers = await row.getByText(flightNumber).filter({ visible: true }).allTextContents();
  if (numbers.length !== 1) throw new Error(`Expected one flight number in the result, found ${numbers.length}`);
  return numbers[0].trim();
}

export const flightEntry = (scope: Scope, number: string) =>
  scope.getByRole('listitem', exact(`Flight ${number}`))
    .or(flights(scope).filter({ has: pageOf(scope).getByText(number, { exact: true }) })).filter({ visible: true });

export const recordCheckbox = (scope: Scope, name: string) =>
  scope.getByRole('checkbox', exact(name)).or(record(scope, name).getByRole('checkbox', exact('Select')))
    .or(record(scope, name).getByRole('checkbox', exact('')));

const dateDisplay = (date: string) => {
  const instant = new Date(`${date}T00:00:00Z`);
  const longDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric',
  }).format(instant);
  return `(?:${escape(date)}|${escape(longDate)})`;
};

const shortDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric',
}).format(new Date(`${date}T00:00:00Z`));

export const dateText = (date: string) => `(?:${dateDisplay(date)}|${escape(shortDate(date))})`;

export async function expectDateField(control: Locator, date: string) {
  await expect(control).toBeVisible();
  if (await control.evaluate(element => element.matches('input, textarea, select'))) {
    await expectFieldValue(control, new RegExp(`^${dateText(date)}$`));
  } else {
    const label = await control.getAttribute('aria-label');
    const prefix = label ? `(?:${escape(label)}\\s*:?\\s*)?` : '';
    await expect(control).toHaveText(new RegExp(`^${prefix}${dateText(date)}$`));
  }
}

export const dateControl = (scope: Scope, name: string) => field(scope, name).or(action(scope, name)).filter({ visible: true });

export function dayAction(scope: Scope, date: string) {
  const label = new RegExp(`^${dateDisplay(date)}(?:,\\s+${escape(shortDate(date))})?(?:,?\\s+[¥￥].*)?$`);
  return scope.getByRole('button', { name: label }).or(scope.getByRole('gridcell', { name: label })).filter({ visible: true });
}

export async function selectChoice(scope: Scope, label: string, option: string) {
  const control = field(scope, label);
  await expect(control).toBeVisible();
  if (await control.evaluate(element => element instanceof HTMLSelectElement)) {
    await control.selectOption({ label: option });
  } else {
    await control.click();
    await scope.getByRole('option', exact(option)).click();
  }
}

export async function expectChoice(scope: Scope, label: string, option: string) {
  const control = field(scope, label);
  if (await control.evaluate(element => element instanceof HTMLSelectElement)) {
    await expect(control.getByRole('option', exact(option))).toHaveJSProperty('selected', true);
  } else if (await control.evaluate(element => element instanceof HTMLInputElement)) {
    await expect(control).toHaveValue(option);
  } else {
    await expect(control).toHaveText(option);
  }
}

export const clockDuration = /^(\d{1,3}):([0-5]\d)(?::([0-5]\d))?$/;
export const unitDuration = /^(?:(\d+)\s*(?:h|hours?)\s+)?(\d+)\s*(?:min|minutes?)\s+([0-5]?\d)\s*(?:sec|seconds?)$/i;
const durationText = `(?:${clockDuration.source.slice(1, -1)}|${unitDuration.source.slice(1, -1)})`;
export const timer = (scope: Scope) => {
  const label = 'Time remaining';
  const separateText = scope.getByText(label, { exact: true }).locator('..').filter({
    has: pageOf(scope).getByText(new RegExp(`^${durationText}$`, 'i')).filter({ visible: true }),
  });
  return scope.getByRole('timer', exact(label))
    .or(scope.getByLabel(label, { exact: true }))
    .or(scope.getByText(new RegExp(`^${label}\\s*:?\\s*${durationText}$`, 'i')))
    .or(separateText)
    .or(region(scope, label));
};
