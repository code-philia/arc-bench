
import { expect, Locator, Page } from '@playwright/test';

type Scope = Page | Locator;
type Match = string | RegExp | Array<string | RegExp>;

export const FIXTURES = {
  notes: {
    pinnedTitle: 'Sprint goals',
    regularTitle: 'Groceries',
    createTitle: 'Weekend plan',
    createContent: 'Visit the farmers market and prep lunches.',
    deleteTitle: 'Delete me',
    deleteContent: 'Temporary note for deletion flow',
    editTitle: 'Project ideas',
    editContent: 'Initial editable content',
    updatedContent: 'Updated editable content for the note editor.',
    archiveTitle: 'Travel plans',
    archiveContent: 'Archive workflow note',
    colorTitle: 'Garden tasks',
    colorContent: 'Color me later',
    labelTitle: 'Team retro',
    labelContent: 'Agenda for team retro',
    workFilteredTitle: 'Design review',
    reminderTitle: 'Call dentist',
    otherTitle: 'Movie list',
    pinTitle: 'Meeting agenda',
    pinContent: 'Pin this note',
  },
  labels: {
    default: 'Reminders',
    work: 'Work',
    renamed: 'Projects',
  },
  search: {
    keyword: 'st',
    matchingTitle: 'Study schedule',
    nonMatchingTitle: 'Groceries',
  },
  colors: {
    lightGreen: /light green|green/i,
  },
} as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPatterns(value: Match): RegExp[] {
  const items = Array.isArray(value) ? value : [value];
  return items.map((item) => item instanceof RegExp ? item : new RegExp(escapeRegExp(item).replace(/\s+/g, '\\s+'), 'i'));
}

function target(scope: Scope): any {
  return scope as any;
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
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.count()) return candidate;
    } catch {
      // continue
    }
  }
  return locators[0].first();
}

function namedLocators(scope: Scope, pattern: RegExp): Locator[] {
  const t = target(scope);
  return [
    t.getByRole('button', { name: pattern }),
    t.getByRole('link', { name: pattern }),
    t.getByRole('menuitem', { name: pattern }),
    t.getByRole('tab', { name: pattern }),
    t.getByRole('checkbox', { name: pattern }),
    t.getByRole('heading', { name: pattern }),
    t.getByRole('option', { name: pattern }),
    t.getByLabel(pattern),
    t.getByPlaceholder(pattern),
    t.getByText(pattern),
  ];
}

async function resolveNamed(scope: Scope, value: Match): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible(namedLocators(scope, pattern));
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible(namedLocators(scope, patterns[0]));
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function clickNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.click();
}

export async function clickFirstAvailable(scope: Scope, values: Match[]): Promise<void> {
  for (const value of values) {
    try {
      const locator = await resolveNamed(scope, value);
      if (await locator.isVisible({ timeout: 200 })) {
        await locator.click();
        return;
      }
    } catch {
      // continue
    }
  }
  await clickNamed(scope, values[0]);
}

export async function hoverNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.hover();
}

export async function expectVisible(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await expect(locator).toBeVisible();
}

export async function expectTextsVisible(scope: Scope, values: Array<string | RegExp>): Promise<void> {
  for (const value of values) {
    await expectVisible(scope, value);
  }
}

export async function fillField(scope: Scope, labelOrPlaceholder: Match, value: string): Promise<void> {
  const patterns = toPatterns(labelOrPlaceholder);
  for (const pattern of patterns) {
    const locator = await firstVisible([
      target(scope).getByLabel(pattern),
      target(scope).getByPlaceholder(pattern),
      target(scope).getByRole('textbox', { name: pattern }),
      target(scope).getByRole('searchbox', { name: pattern }),
    ]);
    try {
      if (await locator.isVisible({ timeout: 200 })) {
        await locator.fill(value);
        return;
      }
    } catch {
      // continue
    }
  }
  const fallback = await firstVisible([
    target(scope).getByRole('textbox'),
    target(scope).locator('textarea'),
  ]);
  await fallback.fill(value);
}

export async function expectTextAbsent(scope: Scope, value: Match): Promise<void> {
  const patterns = toPatterns(value);
  const locator = target(scope).getByText(patterns[0]);
  await expect(locator).toHaveCount(0);
}

export async function openSidebar(page: Page): Promise<void> {
  if (!(await target(page).getByText(/notes/i).first().isVisible().catch(() => false))) {
    await clickFirstAvailable(page, [[/main menu/i, /menu/i, /sidebar/i]]);
  }
}

export async function expectHomePage(page: Page): Promise<void> {
  await expectTextsVisible(page, [/take a note/i, /search/i]);
}

function candidateNoteContainers(scope: Scope): Locator[] {
  const t = target(scope);
  return [
    t.getByRole('article'),
    t.getByRole('listitem'),
    t.getByRole('group'),
    t.locator('main').locator('div'),
  ];
}

export async function noteCard(scope: Scope, text: string | RegExp): Promise<Locator> {
  const pattern = text instanceof RegExp ? text : new RegExp(escapeRegExp(text), 'i');
  for (const container of candidateNoteContainers(scope)) {
    const candidate = container.filter({ has: target(scope).getByText(pattern) }).first();
    try {
      if (await candidate.isVisible({ timeout: 300 })) return candidate;
    } catch {
      // continue
    }
  }
  return target(scope).getByText(pattern).first();
}

export async function expectNoteVisible(page: Page, titleOrText: string | RegExp): Promise<void> {
  await expect(await noteCard(page, titleOrText)).toBeVisible();
}

export async function openNote(page: Page, titleOrText: string | RegExp): Promise<void> {
  await (await noteCard(page, titleOrText)).click();
}

export async function openComposer(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/take a note/i, /note/i]]);
}

export async function fillComposer(page: Page, title: string, content: string): Promise<void> {
  await openComposer(page);
  await fillField(page, [/title/i], title);
  await fillField(page, [/take a note/i, /note/i, /content/i], content);
}

export async function closeEditor(page: Page): Promise<void> {
  try {
    await clickFirstAvailable(page, [[/close/i, /done/i]]);
    return;
  } catch {
    // continue
  }
  await page.keyboard.press('Escape');
}

export async function createNote(page: Page, title: string, content: string): Promise<void> {
  await fillComposer(page, title, content);
  await closeEditor(page);
}

export async function openMoreOptionsForNote(page: Page, titleOrText: string | RegExp): Promise<void> {
  const card = await noteCard(page, titleOrText);
  await hoverNamed(card, [titleOrText]);
  await clickFirstAvailable(card, [[/more/i, /options/i, /menu/i]]);
}

export async function deleteNote(page: Page, title: string): Promise<void> {
  await openMoreOptionsForNote(page, title);
  await clickFirstAvailable(page, [[/delete note/i, /^delete$/i, /move to trash/i]]);
}

export async function archiveNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await clickFirstAvailable(card, [[/archive/i]]);
}

export async function openTrash(page: Page): Promise<void> {
  await openSidebar(page);
  await clickFirstAvailable(page, [[/^trash$/i]]);
}

export async function openArchive(page: Page): Promise<void> {
  await openSidebar(page);
  await clickFirstAvailable(page, [[/^archived?$/i, /^archive$/i]]);
}

export async function unarchiveNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await clickFirstAvailable(card, [[/unarchive/i, /archive/i]]);
}

export async function changeNoteColor(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await clickFirstAvailable(card, [[/background options/i, /color/i]]);
  await clickFirstAvailable(page, [[/light green/i, /green/i]]);
}

export async function chooseColorDuringCreate(page: Page): Promise<void> {
  await openComposer(page);
  await clickFirstAvailable(page, [[/background options/i, /color/i]]);
  await clickFirstAvailable(page, [[/light green/i, /green/i]]);
}

export async function openLabelDialogForNote(page: Page, title: string): Promise<void> {
  await openMoreOptionsForNote(page, title);
  await clickFirstAvailable(page, [[/change labels/i, /labels/i]]);
}

export async function setLabel(page: Page, label: string, checked: boolean): Promise<void> {
  const checkbox = await resolveNamed(page, [new RegExp(escapeRegExp(label), 'i')]);
  try {
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
    return;
  } catch {
    await checkbox.click();
  }
}

export async function pinNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await clickFirstAvailable(card, [[/pin/i]]);
}

export async function unpinNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await clickFirstAvailable(card, [[/unpin/i, /pin/i]]);
}

export async function search(page: Page, keyword: string): Promise<void> {
  await fillField(page, [/search/i], keyword);
}

export async function openSettingsMenu(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/settings/i]]);
}

export async function toggleView(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/list view/i, /grid view/i]]);
}

export async function toggleSidebar(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/main menu/i, /menu/i, /sidebar/i]]);
}
