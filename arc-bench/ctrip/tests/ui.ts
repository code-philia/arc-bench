import { expect, type Locator, type Page } from '@playwright/test';

type Scope = Page | Locator;
const pageOf = (scope: Scope) => 'page' in scope ? scope.page() : scope;
const exact = (name: string) => ({ name, exact: true });
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const action = (scope: Scope, name: string) =>
  scope.getByRole('button', exact(name)).or(scope.getByRole('link', exact(name)))
    .or(scope.getByRole('menuitem', exact(name)));

export const field = (scope: Scope, name: string) =>
  scope.getByLabel(name, { exact: true }).and(scope.locator('input, textarea, select, [contenteditable], [role="combobox"]'))
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

export const region = (scope: Scope, name: string) =>
  scope.getByRole('region', exact(name)).or(scope.getByRole('group', exact(name)))
    .or(scope.getByRole('form', exact(name))).or(scope.getByRole('dialog', exact(name)))
    .or(scope.getByRole('list', exact(name)))
    .or(scope.getByRole('table', exact(name)))
    .or(scope.locator('section, article, fieldset, form, dialog, [role="dialog"], [role="tabpanel"], details').filter({
      has: pageOf(scope).getByRole('heading', exact(name))
        .or(pageOf(scope).locator('legend').and(pageOf(scope).getByText(name, { exact: true }))),
    }));

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

export async function expectDateField(control: Locator, date: string) {
  await expectFieldValue(control, new RegExp(`^${dateDisplay(date)}$`));
}

export function dayAction(scope: Scope, date: string) {
  const label = new RegExp(`^${dateDisplay(date)}(?:$|\\s+[¥￥])`);
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

export const timer = (scope: Scope) => scope.getByRole('timer', exact('Time remaining'))
  .or(scope.getByLabel('Time remaining', { exact: true }))
  .or(scope.getByText(/^Time remaining\s*:?\s+\d{1,3}:\d{2}(?::\d{2})?$/))
  .or(region(scope, 'Time remaining'));
