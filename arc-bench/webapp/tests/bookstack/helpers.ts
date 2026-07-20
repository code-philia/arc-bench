import { expect, Locator, Page } from '@playwright/test';

export const FIXTURES = {
  auth: {
    nickname: 'BookStack User',
    email: 'bookstack_user@example.com',
    password: 'Password123!',
  },
  shelf: {
    name: 'Shelf Alpha',
    updatedName: 'Shelf Alpha Updated',
    description: 'Reference shelf description',
    updatedDescription: 'Updated shelf description',
    tags: 'knowledge-base, docs',
  },
  book: {
    name: 'Book Alpha',
    updatedName: 'Book Alpha Updated',
    description: 'Reference book description',
    updatedDescription: 'Updated book description',
    tags: 'manual, handbook',
  },
  chapter: {
    name: 'Chapter Alpha',
    description: 'Reference chapter description',
  },
  page: {
    name: 'Page Alpha',
    updatedName: 'Page Alpha Updated',
    content: 'Reference page content for BookStack page creation.',
  },
} as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toPattern(value: string | RegExp): RegExp {
  if (value instanceof RegExp) return value;
  return new RegExp(escapeRegExp(value).replace(/\s+/g, '\\s+'), 'i');
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
  return locators[0].first();
}

export async function clickNamed(page: Page, value: string | RegExp): Promise<void> {
  const name = toPattern(value);
  const locator = await firstVisible([
    page.getByRole('button', { name }),
    page.getByRole('link', { name }),
    page.getByRole('tab', { name }),
    page.getByRole('menuitem', { name }),
    page.getByText(name),
  ]);
  await locator.click();
}

export async function expectTextsVisible(page: Page, values: Array<string | RegExp>): Promise<void> {
  for (const value of values) {
    const name = toPattern(value);
    const locator = await firstVisible([
      page.getByRole('heading', { name }),
      page.getByRole('button', { name }),
      page.getByRole('link', { name }),
      page.getByRole('tab', { name }),
      page.getByText(name),
      page.getByLabel(name),
      page.getByPlaceholder(name),
    ]);
    await expect(locator).toBeVisible();
  }
}

export async function fillField(page: Page, labelOrPlaceholder: string, value: string): Promise<void> {
  const name = toPattern(labelOrPlaceholder);
  const locator = await firstVisible([
    page.getByLabel(name),
    page.getByPlaceholder(name),
    page.getByRole('textbox', { name }),
    page.getByRole('searchbox', { name }),
  ]);
  await locator.fill(value);
}

export async function expectSuccessFeedback(page: Page): Promise<void> {
  const locator = await firstVisible([
    page.getByRole('alert'),
    page.getByRole('status'),
    page.getByText(/success|saved|created|deleted|updated/i),
  ]);
  await expect(locator).toBeVisible();
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function openLoginPage(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /^Login$/i);
}

export async function login(page: Page): Promise<void> {
  await openLoginPage(page);
  await fillField(page, 'Email', FIXTURES.auth.email);
  await fillField(page, 'Password', FIXTURES.auth.password);
  const remember = page.getByRole('checkbox', { name: /remember me/i });
  if (await remember.count()) {
    await remember.check();
  }
  await clickNamed(page, /^Login$/i);
}

export async function openShelves(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /^Shelves$/i);
}

export async function openShelfDetails(page: Page): Promise<void> {
  await openShelves(page);
  await clickNamed(page, FIXTURES.shelf.name);
}

export async function openBooks(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /^Books$/i);
}

export async function openBookDetailsFromList(page: Page): Promise<void> {
  await openBooks(page);
  await clickNamed(page, FIXTURES.book.name);
}

export async function openBookDetailsFromShelf(page: Page): Promise<void> {
  await openShelfDetails(page);
  await clickNamed(page, FIXTURES.book.name);
}

export async function openBookCreationFromList(page: Page): Promise<void> {
  await openBooks(page);
  await clickNamed(page, /Create New Book/i);
}

export async function openBookCreationFromShelf(page: Page): Promise<void> {
  await openShelfDetails(page);
  await clickNamed(page, /Create New Book/i);
}

export async function fillBookForm(page: Page, variant: 'create' | 'edit'): Promise<void> {
  await fillField(page, 'Name', variant === 'create' ? FIXTURES.book.name : FIXTURES.book.updatedName);
  await fillField(page, 'Description', variant === 'create' ? FIXTURES.book.description : FIXTURES.book.updatedDescription);
  const tagsField = page.getByRole('textbox', { name: /tags/i }).first();
  if (await tagsField.count()) {
    await tagsField.fill(FIXTURES.book.tags);
  }
}

export async function fillShelfForm(page: Page, variant: 'create' | 'edit'): Promise<void> {
  await fillField(page, 'Name', variant === 'create' ? FIXTURES.shelf.name : FIXTURES.shelf.updatedName);
  await fillField(page, 'Description', variant === 'create' ? FIXTURES.shelf.description : FIXTURES.shelf.updatedDescription);
  const tagsField = page.getByRole('textbox', { name: /tags/i }).first();
  if (await tagsField.count()) {
    await tagsField.fill(FIXTURES.shelf.tags);
  }
}

export async function openPageEditor(page: Page): Promise<void> {
  await openBookDetailsFromList(page);
  await clickNamed(page, /New Page/i);
}

export async function fillPageEditor(page: Page): Promise<void> {
  await fillField(page, 'Name', FIXTURES.page.name);
  const editor = await firstVisible([
    page.getByRole('textbox', { name: /markdown|content|html/i }),
    page.getByLabel(/markdown|content|html/i),
    page.locator('textarea'),
  ]);
  await editor.fill(FIXTURES.page.content);
}

export async function openChapterCreation(page: Page): Promise<void> {
  await openBookDetailsFromList(page);
  await clickNamed(page, /New Chapter/i);
}

export async function fillChapterForm(page: Page): Promise<void> {
  await fillField(page, 'Name', FIXTURES.chapter.name);
  await fillField(page, 'Description', FIXTURES.chapter.description);
}

export async function openPageReading(page: Page): Promise<void> {
  await openBookDetailsFromList(page);
  await clickNamed(page, FIXTURES.page.name);
}

export async function returnHomeByLogo(page: Page): Promise<void> {
  const logo = await firstVisible([
    page.getByRole('link', { name: /bookstack/i }),
    page.getByText(/bookstack/i),
  ]);
  await logo.click();
}
