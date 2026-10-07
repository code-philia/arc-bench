import { expect, test as base, type Locator, type Page } from '@playwright/test';
import { benchmarkNow } from './fixtures/data';

// Fix Date while retaining real timer progression for notification dismissal.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(new Date(benchmarkNow));
    await use(page);
  },
});
export { expect };
export const action = (scope: Page | Locator, name: string) =>
  scope.getByRole('button', { name, exact: true });
export const note = (page: Page, title: string) =>
  page.getByRole('region', { name: title, exact: true });
export const section = (page: Page, name: string) =>
  page.getByRole('region', { name, exact: true });
export const editor = (page: Page) => page.getByRole('dialog', { name: 'Note editor', exact: true });
export const notice = (page: Page, name: string) => page.getByRole('status', { name, exact: true });

export async function openHome(page: Page) {
  await page.goto('/');
  await expect(action(page, 'Take a note')).toBeVisible();
}
export async function navigate(page: Page, name: string) {
  await action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), name).click();
}
export async function beginNote(page: Page) {
  await action(page, 'Take a note').click();
  await expect(editor(page)).toBeVisible();
}
export async function createNote(page: Page, title: string, content: string,
  options: { pinned?: boolean; labels?: string[]; green?: boolean } = {}) {
  await beginNote(page);
  await editor(page).getByRole('textbox', { name: 'Title', exact: true }).fill(title);
  await editor(page).getByRole('textbox', { name: 'Content', exact: true }).fill(content);
  if (options.pinned) await action(editor(page), 'Pin note').click();
  if (options.green) {
    await action(editor(page), 'Background color').click();
    await action(page, 'Light green').click();
  }
  if (options.labels) {
    await action(editor(page), 'Change labels').click();
    await chooseLabels(page, options.labels);
  }
  await action(editor(page), 'Close').click();
  await expect(editor(page)).toBeHidden();
  await expectNote(page, title, content);
}
export async function expectNote(page: Page, title: string, content?: string) {
  await expect(note(page, title)).toHaveCount(1);
  await expect(note(page, title)).toBeVisible();
  await expect(note(page, title).getByText(title, { exact: true })).toBeVisible();
  if (content !== undefined) await expect(note(page, title).getByText(content, { exact: true })).toBeVisible();
}
export async function more(page: Page, title: string) {
  await note(page, title).hover();
  await action(note(page, title), `More options ${title}`).click();
}
export async function deleteNote(page: Page, title: string) {
  await more(page, title);
  await page.getByRole('menuitem', { name: 'Delete Note', exact: true }).click();
  await expect(note(page, title)).toBeHidden();
  await expect(notice(page, 'Note deleted')).toBeVisible();
}
export async function archiveNote(page: Page, title: string) {
  await note(page, title).hover();
  await action(note(page, title), `Archive ${title}`).click();
  await expect(note(page, title)).toBeHidden();
  await expect(notice(page, 'Note archived')).toBeVisible();
}
export async function labelManager(page: Page) {
  await navigate(page, 'Edit Labels');
  const dialog = page.getByRole('dialog', { name: 'Edit Labels', exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}
export async function createLabel(page: Page, label: string) {
  const dialog = await labelManager(page);
  await dialog.getByRole('textbox', { name: 'New label', exact: true }).fill(label);
  await action(dialog, 'Create label').click();
  await expect(dialog.getByRole('textbox', { name: `Label name ${label}`, exact: true })).toHaveValue(label);
  await action(dialog, 'Done').click();
  await expect(dialog).toBeHidden();
  await expect(action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), label)).toBeVisible();
}
export async function chooseLabels(page: Page, labels: string[], checked = true) {
  const dialog = page.getByRole('dialog', { name: 'Note labels', exact: true });
  await expect(dialog).toBeVisible();
  for (const label of labels) {
    const control = dialog.getByRole('checkbox', { name: label, exact: true });
    await control.setChecked(checked);
    await expect(control).toBeChecked({ checked });
  }
  await action(dialog, 'Done').click();
  await expect(dialog).toBeHidden();
}
export async function assignLabels(page: Page, title: string, labels: string[], checked = true) {
  await more(page, title);
  await page.getByRole('menuitem', { name: 'Change labels', exact: true }).click();
  await chooseLabels(page, labels, checked);
}
export async function settingsDialog(page: Page) {
  await action(page, 'Settings menu').click();
  await page.getByRole('menuitem', { name: 'Settings', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Settings', exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function bounds(surface: Locator) {
  await expect(surface).toBeVisible();
  const box = await surface.boundingBox();
  if (!box) throw new Error('Visible note has no rendered bounds');
  return box;
}
