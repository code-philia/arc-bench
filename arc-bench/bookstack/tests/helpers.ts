import { expect, type Page } from '@playwright/test';
import { ACCOUNT, type ShelfData, type BookData, type PageData } from './fixtures/data';
import { action, actionControl, collection, textField, pageEditor, navigationAction, toggle, title, content, accountIdentity, loginSubmit, detailContent, favorite, editableControl, entry } from './support/ui';
export { ACCOUNT, identity, named } from './fixtures/data';
export { action, collection, textField, pageEditor, objectNavigation, navigationAction, toggle, favorite, title, content, accountIdentity, detailContent } from './support/ui';
export async function enter(page: Page) {
  await page.goto('/');
}
export async function go(page: Page, name: string) {
  await navigationAction(page, name).activate();
}
export const home = enter;
export async function text(page: Page, value: string, ownerName: string) {
  await detailContent(page, ownerName, value).expectVisible();
}
export async function login(page: Page, remember = false) {
  await go(page, 'Login');
  await textField(page, 'Email').fill(ACCOUNT.email);
  await textField(page, 'Password').fill(ACCOUNT.password);
  if (remember) await toggle(page, 'Remember Me').set(true);
  await loginSubmit(page).activate();
  await accountIdentity(page, ACCOUNT.nickname).expectVisible();
}
export async function metadata(page: Page, name: string, description: string, tags: string) {
  await textField(page, 'Name').fill(name);
  await textField(page, 'Description').fill(description);
  await fillTags(page, tags);
}

function tagEditors(page: Page) {
  const editable = page.locator('input, textarea, [contenteditable="true"]');
  const flat = page.getByLabel(/^(?:tags|shelf tags|book tags|tag1,\s*tag2)$/i)
    .or(page.getByPlaceholder(/^tag1,\s*tag2$/i))
    .and(editable).filter({ visible: true });
  const names = page.getByLabel(/^tag name$/i)
    .or(page.getByPlaceholder(/^tag name$/i))
    .and(editable).filter({ visible: true });
  return { flat, names };
}

async function openTagEditor(page: Page) {
  const editors = tagEditors(page);
  const toggle = entry(page, /^(?:(?:shelf|book) )?tags$/i)
    .or(page.locator('summary').filter({ hasText: /^(?:(?:shelf|book) )?tags$/i }))
    .filter({ visible: true });
  // Wait for either an editable field or its disclosure; avoid deciding based
  // on a transient render, and do not collapse an editor that is already open.
  await expect.poll(async () =>
    await editors.flat.count() > 0 || await editors.names.count() > 0 || await toggle.count() > 0,
  ).toBe(true);
  if (await editors.flat.count() === 0 && await editors.names.count() === 0) {
    await expect(toggle).toHaveCount(1);
    await actionControl(toggle).activate();
  }
  await expect.poll(async () => await editors.flat.count() + await editors.names.count()).toBeGreaterThan(0);
  return editors;
}

function tagValueEditors(page: Page) {
  return page.getByLabel(/^tag value(?: \(optional\))?$/i)
    .or(page.getByPlaceholder(/^tag value(?: \(optional\))?$/i))
    .and(page.locator('input, textarea, [contenteditable="true"]')).filter({ visible: true });
}

/** Prepare plain tag names, supporting a CSV field or reference-style rows. */
export async function fillTags(page: Page, tags: string) {
  const editors = await openTagEditor(page);
  if (await editors.flat.count() > 0) {
    await expect(editors.flat).toHaveCount(1);
    await editableControl(editors.flat).fill(tags);
    return;
  }
  const wanted = tags.split(',').map(value => value.trim()).filter(Boolean);
  while (await editors.names.count() < wanted.length) {
    const before = await editors.names.count();
    const add = entry(page, /^add (?:another )?tag$/i)
      .filter({ visible: true });
    await expect(add).toHaveCount(1);
    await actionControl(add).activate();
    await expect.poll(() => editors.names.count()).toBeGreaterThan(before);
  }
  // Row indices describe the visible tag editor order, not stored object IDs.
  for (let i = 0; i < await editors.names.count(); i++) {
    await editableControl(editors.names.nth(i)).fill(wanted[i] ?? '');
  }
  const values = tagValueEditors(page);
  for (let i = 0; i < await values.count(); i++) await editableControl(values.nth(i)).fill('');
}

export async function expectMetadata(page: Page, name: string, description: string, tags: string) {
  await textField(page, 'Name').expectValue(name);
  await textField(page, 'Description').expectValue(description);
  const editors = await openTagEditor(page);
  const expected = tags.split(',').map(value => value.trim()).filter(Boolean).sort();
  await expect.poll(async () => {
    if (await editors.flat.count() > 0) {
      await expect(editors.flat).toHaveCount(1);
      return (await editableControl(editors.flat).read()).split(',').map(value => value.trim()).filter(Boolean).sort();
    }
    const names: string[] = [];
    for (let i = 0; i < await editors.names.count(); i++) names.push(await editableControl(editors.names.nth(i)).read());
    return names.map(value => value.trim()).filter(Boolean).sort();
  }).toEqual(expected);
  const values = tagValueEditors(page);
  for (let i = 0; i < await values.count(); i++) await editableControl(values.nth(i)).expectValue('');
}
export async function openShelf(page: Page, name: string) {
  await go(page, 'Shelves');
  await collection(page, 'Shelf list').item(name).open();
  await heading(page, name);
}
export async function openBook(page: Page, name: string) {
  await go(page, 'Books');
  await collection(page, 'Book list').item(name).open();
  await heading(page, name);
}
export async function beginShelf(page: Page) {
  await go(page, 'Shelves');
  await action(page, 'New Shelf').activate();
}
export async function beginBook(page: Page) {
  await go(page, 'Books');
  await action(page, 'Create New Book').activate();
}
export async function createShelf(page: Page, data: ShelfData) {
  const { name, description, tags } = data;
  await beginShelf(page);
  await metadata(page, name, description, tags);
  await action(page, 'Save Shelf').activate();
  await collection(page, 'Shelf list').item(name).expectCount(1);
  await collection(page, 'Shelf list').item(name).expectVisible();
  return name;
}
export async function createBook(page: Page, data: BookData) {
  const { name, description, tags } = data;
  await beginBook(page);
  await metadata(page, name, description, tags);
  await action(page, 'Save Book').activate();
  await heading(page, name);
  return name;
}
export async function createShelfBook(page: Page, data: BookData) {
  if (!data.shelfName) throw new Error('createShelfBook requires the shelf created by this test.');
  await openShelf(page, data.shelfName);
  await action(page, 'Create New Book').activate();
  const { name, description, tags } = data;
  await metadata(page, name, description, tags);
  await action(page, 'Save Book').activate();
  await heading(page, name);
  return name;
}
export async function createPage(page: Page, data: PageData, draft = false) {
  if (data.chapterName !== undefined) throw new Error('createPage does not support chapterName; refusing to create a page under the wrong parent');
  if (!data.bookName) throw new Error('createPage requires the book created by this test.');
  const book = data.bookName;
  const name = data.title;
  await openBook(page, book);
  await action(page, 'New Page').activate();
  await pageEditor(page).title.fill(name);
  await pageEditor(page).body.fill(data.content);
  await action(page, draft ? 'Save Draft' : 'Save Page').activate();
  if (draft) {
    // Source allows draft save to stay in editor; observe it via the parent book.
    await openBook(page, book);
  } else {
    await heading(page, book);
  }
  await collection(page, 'Page list', { owner: book }).item(name).expectCount(1);
  await collection(page, 'Page list', { owner: book }).item(name).expectVisible();
  return name;
}

export async function heading(page: Page, name: string) { await title(page, name).expectVisible(); }

/** Restore only favorites created by this test; never clear the shared account's history. */
export async function withFavoriteCleanup(page: Page, body: (track: (book: string) => void) => Promise<void>) {
  const books = new Set<string>();
  const errors: unknown[] = [];
  try { await body(book => books.add(book)); } catch (error) { errors.push(error); }
  for (const book of books) {
    try { await openBook(page, book); await favorite(page).set(false); }
    catch (error) { errors.push(error); }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length) throw new AggregateError(errors, 'Test and/or own-favorite restoration failed');
}
