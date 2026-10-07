import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

export const ACCOUNT = {
  nickname: 'BookStack User',
  email: 'bookstack_user@example.com',
  password: 'Password123!',
};
export const BOOTSTRAP_SHELF = 'Benchmark Bootstrap Shelf';

// Literal scenario titles are unique in this package; normalize them to readable case ids.
export function identity(info: TestInfo): string {
  const run = process.env.BOOKSTACK_RUN_ID;
  if (!run || !/^[A-Za-z0-9_-]{1,40}$/.test(run)) {
    throw new Error('Supply BOOKSTACK_RUN_ID (1–40 letters, numbers, underscores or hyphens) for a fresh evaluation world.');
  }
  const caseId = info.title.replace(/[^A-Za-z0-9]+/g, '-');
  return `${run}-w${info.workerIndex}-${caseId}`;
}
export const named = (id: string, base: string) => `${base} [${id}]`;
export const region = (page: Page, name: string) => page.getByRole('region', { name, exact: true });
export const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
// The contract allows either a link or a button. Union does not choose by DOM order.
export const entry = (scope: Page | Locator, name: string) =>
  scope.getByRole('link', { name, exact: true }).or(scope.getByRole('button', { name, exact: true }));
export async function enter(page: Page) {
  await page.goto('/');
}
export async function go(page: Page, name: string) {
  await page.getByRole('link', { name, exact: true }).click();
}
export const home = enter;
export async function heading(page: Page, name: string) {
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
export async function text(page: Page, value: string) {
  await expect(page.getByText(value, { exact: true })).toBeVisible();
}
export async function login(page: Page, remember = false) {
  await go(page, 'Login');
  await page.getByLabel('Email', { exact: true }).fill(ACCOUNT.email);
  await page.getByLabel('Password', { exact: true }).fill(ACCOUNT.password);
  if (remember) await page.getByRole('checkbox', { name: 'Remember Me', exact: true }).check();
  await button(page, 'Login').click();
  await expect(page.getByText(ACCOUNT.nickname, { exact: true })).toBeVisible();
  await expect(region(page, 'My Recent Drafts')).toBeVisible();
}
export async function metadata(page: Page, name: string, description: string, tags: string) {
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Description', { exact: true }).fill(description);
  await page.getByLabel('Tags', { exact: true }).fill(tags);
}
export async function expectMetadata(page: Page, name: string, description: string, tags: string) {
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue(name);
  await expect(page.getByLabel('Description', { exact: true })).toHaveValue(description);
  await expect(page.getByLabel('Tags', { exact: true })).toHaveValue(tags);
}
export async function openShelf(page: Page, name: string) {
  await go(page, 'Shelves');
  await entry(region(page, 'Shelf list'), name).click();
  await heading(page, name);
}
export async function openBook(page: Page, name: string) {
  await go(page, 'Books');
  await entry(region(page, 'Book list'), name).click();
  await heading(page, name);
}
export async function beginShelf(page: Page) {
  await openShelf(page, BOOTSTRAP_SHELF);
  await entry(page, 'New Shelf').click();
}
export async function beginBook(page: Page) {
  await go(page, 'Books');
  await entry(page, 'Create New Book').click();
}
export async function createShelf(page: Page, id: string, base: string, description = 'Reference shelf description.', tags = 'knowledge-base, docs') {
  const name = named(id, base);
  await beginShelf(page);
  await metadata(page, name, description, tags);
  await button(page, 'Save Shelf').click();
  await expect(entry(region(page, 'Shelf list'), name)).toHaveCount(1);
  await expect(entry(region(page, 'Shelf list'), name)).toBeVisible();
  return name;
}
export async function createBook(page: Page, id: string, base: string, description = 'Reference book description.', tags = 'manual, handbook') {
  const name = named(id, base);
  await beginBook(page);
  await metadata(page, name, description, tags);
  await button(page, 'Save Book').click();
  await heading(page, name);
  return name;
}
export async function createShelfBook(page: Page, id: string, shelf: string, base: string) {
  await openShelf(page, shelf);
  await entry(page, 'Create New Book').click();
  const name = named(id, base);
  await metadata(page, name, 'Book created by corresponding prerequisite behavior.', 'created, shelf-book');
  await button(page, 'Save Book').click();
  await heading(page, name);
  return name;
}
export async function createPage(page: Page, id: string, book: string, base: string, content: string, draft = false) {
  await openBook(page, book);
  await button(page, 'New Page').click();
  const name = named(id, base);
  await page.getByPlaceholder('Page title', { exact: true }).fill(name);
  await page.getByPlaceholder('Write your page content here...', { exact: true }).fill(content);
  await button(page, draft ? 'Save Draft' : 'Save Page').click();
  if (draft) {
    // Source allows draft save to stay in editor; observe it via the parent book.
    await openBook(page, book);
  } else {
    await heading(page, book);
  }
  await expect(entry(region(page, 'Page list'), name)).toHaveCount(1);
  await expect(entry(region(page, 'Page list'), name)).toBeVisible();
  return name;
}
