import { expect, Locator, Page } from '@playwright/test';

export const FIXTURES = {
  auth: {
    nickname: 'BookStack User',
    email: 'bookstack_user@example.com',
    password: 'Password123!',
  },
  shelves: {
    list: { name: 'Shelf 4.1' },
    details: { name: 'Shelf 4.2.1' },
    create: {
      contextName: 'Shelf 4.3.1',
      name: 'Shelf Created 4.3.1',
      description: 'Shelf created by REQ-4.3.1.',
      tags: 'created, shelf',
    },
    cancelCreate: { contextName: 'Shelf 4.3.2' },
    deleteConfirm: { name: 'Shelf 4.4.1' },
    deleteCancel: { name: 'Shelf 4.4.2' },
    editSave: {
      name: 'Shelf 4.5.1',
      updatedName: 'Shelf Updated 4.5.1',
      description: 'Reference shelf description.',
      updatedDescription: 'Shelf updated by REQ-4.5.1.',
      tags: 'knowledge-base, docs',
    },
    editCancel: {
      name: 'Shelf 4.5.2',
      updatedName: 'Shelf Updated 4.5.2',
      description: 'Reference shelf description.',
      updatedDescription: 'Shelf updated by REQ-4.5.2.',
      tags: 'knowledge-base, docs',
    },
    bookDetails: { name: 'Shelf 5.2.2' },
    bookCreate: { name: 'Shelf 5.6.1' },
    recentlyViewed: { name: 'Shelf 7.1' },
    recentlyViewedNavigation: { name: 'Shelf 7.2' },
  },
  books: {
    list: { name: 'Book 5.1' },
    detailsFromList: { name: 'Book 5.2.1' },
    detailsFromShelf: { shelfName: 'Shelf 5.2.2', name: 'Book 5.2.2' },
    createFromList: {
      name: 'Book Created 5.3.1',
      description: 'Book created by REQ-5.3.1.',
      tags: 'created, book',
    },
    editSave: {
      name: 'Book 5.4.1',
      updatedName: 'Book Updated 5.4.1',
      description: 'Reference book description.',
      updatedDescription: 'Book updated by REQ-5.4.1.',
      tags: 'manual, handbook',
    },
    editCancel: {
      name: 'Book 5.4.2',
      updatedName: 'Book Updated 5.4.2',
      description: 'Reference book description.',
      updatedDescription: 'Book updated by REQ-5.4.2.',
      tags: 'manual, handbook',
    },
    deleteConfirm: { name: 'Book 5.5.1' },
    deleteCancel: { name: 'Book 5.5.2' },
    createFromShelf: {
      shelfName: 'Shelf 5.6.1',
      name: 'Book Created 5.6.1',
      description: 'Book created by REQ-5.6.1.',
      tags: 'created, shelf-book',
    },
    pageSave: { name: 'Book 6.1.1' },
    draftSave: { name: 'Book 6.1.2' },
    draftDelete: { bookName: 'Book 6.1.3', pageName: 'Draft 6.1.3' },
    chapterCreate: { name: 'Book 6.2.1' },
    pageRead: { name: 'Book 6.3.1', pageName: 'Page 6.3.1' },
    pageEdit: { name: 'Book 6.3.2', pageName: 'Page 6.3.2' },
    favorite: { name: 'Book 8.1' },
    favoriteNavigation: { name: 'Book 8.2' },
    recentlyUpdated: { name: 'Book 9.1' },
  },
  pages: {
    save: { name: 'Page Created 6.1.1', content: 'Page content created by REQ-6.1.1.' },
    draft: { name: 'Page Draft 6.1.2', content: 'Draft content created by REQ-6.1.2.' },
    recentlyUpdated: { name: 'Page Updated 9.1', content: 'Page content created by REQ-9.1.' },
  },
  chapter: {
    name: 'Chapter Created 6.2.1',
    description: 'Chapter created by REQ-6.2.1.',
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

export async function openShelfDetails(page: Page, shelfName: string): Promise<void> {
  await openShelves(page);
  await clickNamed(page, shelfName);
}

export async function openBooks(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /^Books$/i);
}

export async function openBookDetailsFromList(page: Page, bookName: string): Promise<void> {
  await openBooks(page);
  await clickNamed(page, bookName);
}

export async function openBookDetailsFromShelf(page: Page, shelfName: string, bookName: string): Promise<void> {
  await openShelfDetails(page, shelfName);
  await clickNamed(page, bookName);
}

export async function openBookCreationFromList(page: Page): Promise<void> {
  await openBooks(page);
  await clickNamed(page, /Create New Book/i);
}

export async function openBookCreationFromShelf(page: Page, shelfName: string): Promise<void> {
  await openShelfDetails(page, shelfName);
  await clickNamed(page, /Create New Book/i);
}

export async function fillBookForm(
  page: Page,
  data: { name: string; description: string; tags: string; updatedName?: string; updatedDescription?: string },
  mode: 'create' | 'edit' = 'create',
): Promise<void> {
  await fillField(page, 'Name', mode === 'edit' ? data.updatedName ?? data.name : data.name);
  await fillField(page, 'Description', mode === 'edit' ? data.updatedDescription ?? data.description : data.description);
  const tagsField = page.getByRole('textbox', { name: /tags/i }).first();
  if (await tagsField.count()) {
    await tagsField.fill(data.tags);
  }
}

export async function fillShelfForm(
  page: Page,
  data: { name: string; description: string; tags: string; updatedName?: string; updatedDescription?: string },
  mode: 'create' | 'edit' = 'create',
): Promise<void> {
  await fillField(page, 'Name', mode === 'edit' ? data.updatedName ?? data.name : data.name);
  await fillField(page, 'Description', mode === 'edit' ? data.updatedDescription ?? data.description : data.description);
  const tagsField = page.getByRole('textbox', { name: /tags/i }).first();
  if (await tagsField.count()) {
    await tagsField.fill(data.tags);
  }
}

export async function openPageEditor(page: Page, bookName: string): Promise<void> {
  await openBookDetailsFromList(page, bookName);
  await clickNamed(page, /New Page/i);
}

export async function openDraftPageEditor(page: Page, bookName: string, pageName: string): Promise<void> {
  await openBookDetailsFromList(page, bookName);
  await clickNamed(page, pageName);
}

export async function fillPageEditor(page: Page, data: { name: string; content: string }): Promise<void> {
  await fillField(page, 'Name', data.name);
  const editor = await firstVisible([
    page.getByRole('textbox', { name: /markdown|content|html/i }),
    page.getByLabel(/markdown|content|html/i),
    page.locator('textarea'),
  ]);
  await editor.fill(data.content);
}

export async function openChapterCreation(page: Page, bookName: string): Promise<void> {
  await openBookDetailsFromList(page, bookName);
  await clickNamed(page, /New Chapter/i);
}

export async function fillChapterForm(page: Page, data: { name: string; description: string }): Promise<void> {
  await fillField(page, 'Name', data.name);
  await fillField(page, 'Description', data.description);
}

export async function openPageReading(page: Page, bookName: string, pageName: string): Promise<void> {
  await openBookDetailsFromList(page, bookName);
  await clickNamed(page, pageName);
}

export async function returnHomeByLogo(page: Page): Promise<void> {
  const logo = await firstVisible([
    page.getByRole('link', { name: /bookstack/i }),
    page.getByText(/bookstack/i),
  ]);
  await logo.click();
}
