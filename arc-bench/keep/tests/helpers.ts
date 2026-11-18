import { expect, test, type Locator, type Page } from '@playwright/test';
export { test, expect };
type Scope = Page | Locator;
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function action(scope: Scope, name: string) {
  const named = { name, exact: true };
  return scope.getByRole('button', named).or(scope.getByRole('link', named))
    .or(scope.getByRole('menuitem', named)).or(scope.getByRole('tab', named))
    .or(scope.locator('a:not([href])[onclick]').filter({ hasText: new RegExp('^' + escape(name) + '$') }))
    .filter({ visible: true });
}

function innermost(candidates: Locator) {
  const visible = candidates.filter({ visible: true });
  return visible.filter({ hasNot: visible });
}

export function note(scope: Scope, title: string): Locator {
  if ('page' in scope) return note(scope.page(), title).and(scope.locator('*'));
  const named = { name: title, exact: true };
  return innermost(scope.getByRole('region', named).or(scope.getByRole('group', named))
    .or(scope.locator('article, li, tr, [role="article"], [role="listitem"], [role="row"]')
      .filter({ has: scope.getByText(title, { exact: true }).filter({ visible: true }) })));
}

export function section(page: Page, name: string) {
  return innermost(page.getByRole('region', { name, exact: true })
    .or(page.getByRole('group', { name, exact: true }))
    .or(page.locator('section, aside, main').filter({ has: page.getByRole('heading', { name, exact: true }) })));
}

export function sidebar(page: Page) {
  return innermost(page.getByRole('navigation', { name: 'Sidebar', exact: true })
    .or(page.getByRole('navigation').filter({ has: action(page, 'Notes') }).filter({ has: action(page, 'Edit Labels') })));
}

export function field(scope: Scope, name: string) {
  return scope.getByRole('textbox', { name, exact: true }).or(scope.getByLabel(name, { exact: true }))
    .or(scope.getByPlaceholder(name, { exact: true })).and(scope.locator('input, textarea, [contenteditable="true"]'))
    .filter({ visible: true });
}

export const searchField = (page: Page) => page.getByRole('searchbox', { name: 'Search', exact: true })
  .filter({ visible: true }).or(field(page, 'Search'));
export const toggle = (scope: Scope, name: string) => scope.getByRole('checkbox', { name, exact: true })
  .or(scope.getByRole('switch', { name, exact: true })).filter({ visible: true });

export function editor(page: Page) {
  const complete = (surface: Locator) => surface.filter({ has: field(page, 'Title') })
    .filter({ has: field(page, 'Content').or(page.getByPlaceholder('Take a note...', { exact: true }).and(page.locator('textarea')).filter({ visible: true })) })
    .filter({ has: action(page, 'Close') });
  const boundaries = 'form, dialog, [role="dialog"]';
  const semantic = complete(page.getByRole('dialog').or(page.locator('form:not(:is(dialog, [role="dialog"]) *)')));
  // Inline fallback cannot assemble an editor from controls in separate form or dialog boundaries.
  const inline = complete(page.locator(`:is(section, div, fieldset):not(${boundaries}):not(:is(${boundaries}) *)`)
    .filter({ hasNot: page.locator(boundaries + ', nav, header, footer, main').filter({ visible: true }) }));
  return semantic.filter({ visible: true }).or(innermost(inline));
}

export function panel(page: Page, name: string) {
  return innermost(page.getByRole('dialog', { name, exact: true })
    .or(page.getByRole('form', { name, exact: true }))
    .or(page.locator('section, form, dialog, [role="dialog"]').filter({ has: page.getByRole('heading', { name, exact: true }) })));
}

export function notice(page: Page, name: string) {
  const surfaces = page.getByRole('status').or(page.getByRole('alert')).or(page.locator('[aria-live="polite"], [aria-live="assertive"]'));
  return innermost(surfaces.filter({ has: page.getByText(name, { exact: true }).filter({ visible: true }) })
    .or(surfaces.filter({ hasText: new RegExp('^' + escape(name) + '(?:\\s*(?:Undo|Dismiss notification))*$') })
      .filter({ hasNot: page.getByText(name, { exact: true }).filter({ visible: false }) })));
}

export const noteAction = (page: Page, title: string, name: string) =>
  action(note(page, title), name + ' ' + title).or(action(note(page, title), name));

export async function expectCurrent(page: Page, name: string) {
  const entry = action(sidebar(page), name);
  await expect(entry).toBeVisible();
  await expect.poll(() => entry.evaluate(el => ['page', 'true'].includes(el.getAttribute('aria-current') ?? '')
    || el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-pressed') === 'true')).toBe(true);
}

export async function openHome(page: Page) {
  await page.goto('/');
  await expect(action(page, 'Take a note')).toBeVisible();
}
export async function navigate(page: Page, name: string) {
  await action(sidebar(page), name).click();
}
export async function beginNote(page: Page) {
  await action(page, 'Take a note').click();
  await expect(editor(page)).toBeVisible();
}
export async function createNote(page: Page, title: string, content: string,
  options: { pinned?: boolean; labels?: string[]; green?: boolean } = {}) {
  await beginNote(page);
  await field(editor(page), 'Title').fill(title);
  await noteContent(page).fill(content);
  if (options.pinned) await action(editor(page), 'Pin note').click();
  if (options.green) {
    await action(editor(page), 'Background color').click();
    await chooseGreen(page);
  }
  if (options.labels) {
    await action(editor(page), 'Change labels').click();
    await chooseLabels(page, options.labels);
  }
  await closeEditor(page);
  await expectNote(page, title, content);
}
export function noteContent(page: Page) {
  const surface = editor(page);
  return field(surface, 'Content').or(surface.getByPlaceholder('Take a note...', { exact: true })
    .and(surface.locator('textarea')).filter({ visible: true }));
}

export async function closeEditor(page: Page) {
  const original = await editor(page).elementHandle();
  if (!original) throw new Error('The note editor disappeared before closing');
  try {
    await action(editor(page), 'Close').click();
    await expect.poll(() => original.isVisible()).toBe(false);
    await expect(editor(page)).toHaveCount(0);
  } finally {
    await original.dispose();
  }
}

export async function expectFieldValue(control: Locator, value: string) {
  await expect.poll(() => control.evaluate(el => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
    ? el.value : (el as HTMLElement).innerText)).toBe(value);
}

export async function expectNote(scope: Scope, title: string, content?: string) {
  const record = note(scope, title);
  await expect(record).toHaveCount(1);
  await expect(record).toBeVisible();
  await expect.poll(() => record.getByText(title, { exact: true }).filter({ visible: true }).count()).toBeGreaterThan(0);
  if (content !== undefined) {
    await expect.poll(() => record.getByText(content, { exact: true }).filter({ visible: true }).count()).toBeGreaterThan(0);
    if (content.includes('\n')) await expect.poll(() => record.innerText()).toContain(content);
  }
}

export async function openNote(page: Page, title: string) {
  const record = note(page, title);
  await expect(record).toHaveCount(1);
  await record.hover();
  const opening = noteAction(page, title, 'Open').or(action(record, title));
  if (await opening.count()) await opening.click();
  else await record.click();
  await expect(editor(page)).toBeVisible();
}

export async function chooseGreen(page: Page) {
  await action(page, 'Light green').or(page.getByRole('radio', { name: 'Light green', exact: true }).filter({ visible: true })).click();
}

export async function expectGreen(page: Page, title: string) {
  const record = note(page, title);
  await expect.poll(() => record.evaluate(el => {
    const rgba = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    const [r, g, b, a = 1] = rgba;
    return a > 0 && r >= 100 && b >= 100 && g >= 150 && g - r >= 6 && g - b >= 6;
  }), { message: 'the note surface itself is light green' }).toBe(true);
  await record.hover();
  const descriptive = action(record, 'Background color ' + title + ': Light green').or(action(record, 'Background color: Light green'));
  const control = descriptive.or(noteAction(page, title, 'Background color'));
  await expect(control).toBeVisible();
  if (await descriptive.count() === 0) await expect(control).toHaveAccessibleDescription(/\bLight green\b/i);
}

export async function expectHighlighted(page: Page, title: string, text: string, keyword: string) {
  const record = note(page, title);
  const host = record.getByText(text, { exact: true }).filter({ visible: true });
  const tokens = host.locator('mark, span, b, strong, em, [role="region"]')
    .filter({ hasText: new RegExp('^' + escape(keyword) + '$', 'i'), visible: true });
  const fragments = tokens.filter({ hasNot: page.locator('mark, span, b, strong, em, [role="region"]')
    .filter({ hasText: new RegExp('^' + escape(keyword) + '$', 'i'), visible: true }) });
  const expected = text.toLowerCase().split(keyword.toLowerCase()).length - 1;
  await expect(fragments).toHaveCount(expected);
  for (const fragment of await fragments.all()) {
    await expect.poll(() => fragment.evaluate(el => {
      const painted = (node: Element | null) => {
        while (node) {
          const color = getComputedStyle(node).backgroundColor;
          if (color !== 'rgba(0, 0, 0, 0)') return color;
          node = node.parentElement;
        }
        return 'rgb(255, 255, 255)';
      };
      const style = getComputedStyle(el), parent = getComputedStyle(el.parentElement!);
      return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        && (painted(el) !== painted(el.parentElement) || style.color !== parent.color
          || style.fontWeight !== parent.fontWeight || style.fontStyle !== parent.fontStyle
          || style.textDecorationLine !== parent.textDecorationLine);
    }), { message: 'the matching fragment is visibly highlighted' }).toBe(true);
  }
}
export async function more(page: Page, title: string) {
  await note(page, title).hover();
  const button = noteAction(page, title, 'More options');
  await button.focus();
  await expect(button).toBeFocused();
  await button.press('Enter');
}
export async function deleteNote(page: Page, title: string) {
  await more(page, title);
  await action(page, 'Delete Note').click();
  await expect(note(page, title)).toBeHidden();
  await expect(notice(page, 'Note deleted')).toBeVisible();
}
export async function archiveNote(page: Page, title: string) {
  await note(page, title).hover();
  await noteAction(page, title, 'Archive').click();
  await expect(note(page, title)).toBeHidden();
  await expect(notice(page, 'Note archived')).toBeVisible();
}
export async function labelManager(page: Page) {
  await navigate(page, 'Edit Labels');
  const dialog = panel(page, 'Edit Labels');
  await expect(dialog).toBeVisible();
  return dialog;
}
export async function createLabel(page: Page, label: string) {
  const dialog = await labelManager(page);
  await field(dialog, 'New label').fill(label);
  await action(dialog, 'Create label').click();
  await labelField(dialog, label);
  await action(dialog, 'Done').click();
  await expect(dialog).toBeHidden();
  await expect(action(sidebar(page), label)).toBeVisible();
}

export async function labelField(dialog: Locator, value: string, previousName = value) {
  const candidates = field(dialog, 'Label name').or(field(dialog, 'Label name ' + value))
    .or(field(dialog, 'Label name ' + previousName)).and(dialog.locator('input, textarea'));
  let positions: number[] = [];
  await expect.poll(async () => {
    positions = await candidates.evaluateAll((elements, name) => elements.flatMap((el, i) =>
      (el as HTMLInputElement).value === name ? [i] : []), value);
    return positions.length;
  }, { message: 'one editable row carries the exact saved label name' }).toBe(1);
  const match = candidates.nth(positions[0]);
  await expect(match).toHaveValue(value);
  return match;
}

export async function labelCommand(dialog: Locator, command: 'Save label' | 'Delete label', original: string, value = original) {
  const field = await labelField(dialog, value, original);
  const row = field.locator('xpath=ancestor::*[self::li or self::tr or self::fieldset or @role="listitem" or @role="row"][1]')
    .and(dialog.locator('*'));
  return action(dialog, command + ' ' + original).or(action(row, command)).or(action(row, command + ' ' + value));
}
export async function chooseLabels(page: Page, labels: string[], checked = true) {
  const dialog = panel(page, 'Note labels');
  await expect(dialog).toBeVisible();
  for (const label of labels) {
    const control = toggle(dialog, label);
    if (await control.isChecked() !== checked) await control.click();
    await expect(control).toBeChecked({ checked });
  }
  await action(dialog, 'Done').click();
  await expect(dialog).toBeHidden();
}
export async function assignLabels(page: Page, title: string, labels: string[], checked = true) {
  await more(page, title);
  await action(page, 'Change labels').click();
  await chooseLabels(page, labels, checked);
}
export async function settingsDialog(page: Page) {
  await action(page, 'Settings menu').click();
  await action(page, 'Settings').click();
  const dialog = panel(page, 'Settings');
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function bounds(surface: Locator) {
  await expect(surface).toBeVisible();
  const box = await surface.boundingBox();
  if (!box) throw new Error('Visible note has no rendered bounds');
  return box;
}
