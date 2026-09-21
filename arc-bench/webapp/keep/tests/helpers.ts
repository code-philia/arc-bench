
import { expect, Locator, Page } from '@playwright/test';

type Scope = Page | Locator;
type Match = string | RegExp | Array<string | RegExp>;

export const FIXTURES = {
  notes: {
    pinnedTitle: 'Sprint goals',
    regularTitle: 'Groceries',
    createTitle: 'Weekend plan',
    createContent: 'Visit the farmers market and prep lunches.',
    delete231Title: 'Delete me 2.3.1',
    delete232Title: 'Delete me 2.3.2',
    delete233Title: 'Delete me 2.3.3',
    deleteContent: 'Temporary note for deletion flow',
    editTitle: 'Project ideas',
    editContent: 'Initial editable content',
    updatedContent: 'Updated editable content for the note editor.',
    archive251Title: 'Travel plans 2.5.1',
    archive252Title: 'Travel plans 2.5.2',
    archive253Title: 'Travel plans 2.5.3',
    archive254Title: 'Travel plans 2.5.4',
    archiveContent: 'Archive workflow note',
    colorExistingTitle: 'Garden tasks existing',
    colorCreatedTitle: 'Garden tasks created',
    colorContent: 'Color me later',
    labelAddTitle: 'Team retro add label',
    labelRemoveTitle: 'Team retro remove label',
    labelContent: 'Agenda for team retro',
    workFilteredTitle: 'Design review',
    reminderExistingTitle: 'Call dentist existing',
    reminderCreatedTitle: 'Call dentist created',
    otherTitle: 'Movie list',
    pin231Title: 'Meeting agenda 2.8.1',
    pin232Title: 'Meeting agenda 2.8.2',
    pinCreatedTitle: 'Meeting agenda created',
    pinContent: 'Pin this note',
  },
  labels: {
    default: 'Reminders',
    work: 'Work',
    editable: 'Work editable',
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
  const patterns = toPatterns(value);
  const t = target(scope);
  const actions = patterns.flatMap((pattern) => [
    t.getByRole('button', { name: pattern }),
    t.getByRole('link', { name: pattern }),
    t.getByRole('menuitem', { name: pattern }),
    t.getByRole('tab', { name: pattern }),
  ]);
  const locator = await firstVisible(actions);
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
  const pattern = patterns[0];
  const field = target(scope).getByRole('textbox', { name: pattern });
  await expect(field).toHaveCount(1);
  await field.fill(value);
}

export async function expectTextAbsent(scope: Scope, value: Match): Promise<void> {
  const patterns = toPatterns(value);
  const locator = target(scope).getByText(patterns[0]);
  await expect(locator).toHaveCount(0);
}

export async function openSidebar(page: Page): Promise<void> {
  if (!(await page.getByRole('complementary').getByRole('button', { name: /^Notes$/i }).isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /^Toggle sidebar$/i }).click();
  }
}

export async function expectHomePage(page: Page): Promise<void> {
  await expect(page.getByRole('region', { name: /^Notes workspace$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Take a note$/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Search$/i })).toBeVisible();
}

function candidateNoteContainers(scope: Scope): Locator[] {
  const t = target(scope);
  return [t.getByRole('article')];
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
  return target(scope).getByRole('article').filter({ hasText: pattern }).first();
}

export async function expectNoteVisible(page: Page, titleOrText: string | RegExp): Promise<void> {
  await expect(await noteCard(page, titleOrText)).toBeVisible();
}

export async function expectNoteAbsent(page: Page, titleOrText: string | RegExp): Promise<void> {
  const card = await noteCard(page, titleOrText);
  await expect(card).toHaveCount(0);
}

export async function openNote(page: Page, titleOrText: string | RegExp): Promise<void> {
  await (await noteCard(page, titleOrText)).click();
}

export async function openComposer(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Take a note$/i }).click();
}

function noteEditor(page: Page): Locator {
  return page.getByRole('dialog', { name: /^Note editor$/i });
}

export async function fillComposer(page: Page, title: string, content: string): Promise<void> {
  await openComposer(page);
  const dialog = noteEditor(page);
  await dialog.getByRole('textbox', { name: /^Title$/i }).fill(title);
  await dialog.getByRole('textbox', { name: /^Note content$/i }).fill(content);
}

export async function closeEditor(page: Page): Promise<void> {
  const dialog = noteEditor(page);
  await expect(dialog).toHaveCount(1);
  await dialog.getByRole('button', { name: /^Close$/i }).click();
}

export async function createNote(page: Page, title: string, content: string): Promise<void> {
  await fillComposer(page, title, content);
  await closeEditor(page);
}

export async function openMoreOptionsForNote(page: Page, titleOrText: string | RegExp): Promise<void> {
  const card = await noteCard(page, titleOrText);
  await hoverNamed(card, [titleOrText]);
  await card.getByRole('button', { name: /^More options$/i }).click();
}

export async function deleteNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^More options$/i }).click();
  await card.getByRole('button', { name: /^Delete Note$/i }).click();
}

export async function archiveNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^Archive$/i }).click();
}

export async function openTrash(page: Page): Promise<void> {
  await openSidebar(page);
  await page.getByRole('complementary').getByRole('button', { name: /^Trash$/i }).click();
}

export async function clickUndo(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Undo$/i }).click();
}

export async function clickSidebarLabel(page: Page, label: string): Promise<void> {
  await page.getByRole('complementary').getByRole('button', { name: new RegExp(`^${escapeRegExp(label)}$`, 'i') }).click();
}

export async function openArchive(page: Page): Promise<void> {
  await openSidebar(page);
  await page.getByRole('complementary').getByRole('button', { name: /^Archive$/i }).click();
}

export async function unarchiveNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^Unarchive$/i }).click();
}

export async function changeNoteColor(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^Change color$/i }).click();
  await card.getByRole('button', { name: /^Light green$/i }).click();
}

export async function chooseColorDuringCreate(page: Page): Promise<void> {
  await openComposer(page);
  const dialog = noteEditor(page);
  await dialog.getByRole('button', { name: /^Change color$/i }).click();
  await dialog.getByRole('button', { name: /^Light green$/i }).click();
}

export async function openLabelDialogForNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^More options$/i }).click();
  await card.getByRole('button', { name: /^Change labels$/i }).click();
}

export async function setLabel(page: Page, label: string, checked: boolean): Promise<void> {
  const checkbox = noteEditor(page).getByRole('checkbox', {
    name: new RegExp(`^${escapeRegExp(label)}$`, 'i'),
  });
  if (checked) await checkbox.check();
  else await checkbox.uncheck();
}

export async function pinNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^Pin note$/i }).click();
}

export async function unpinNote(page: Page, title: string): Promise<void> {
  const card = await noteCard(page, title);
  await hoverNamed(card, [title]);
  await card.getByRole('button', { name: /^Unpin note$/i }).click();
}

export async function search(page: Page, keyword: string): Promise<void> {
  await page.getByRole('textbox', { name: /^Search$/i }).fill(keyword);
}

export async function openSettingsMenu(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Settings$/i }).first().click();
}

export async function openDetailedSettings(page: Page): Promise<void> {
  await page.getByRole('menu').getByRole('menuitem', { name: /^Settings$/i }).click();
}

export async function renameLabel(page: Page, currentName: string, newName: string): Promise<void> {
  const row = page.getByRole('group', { name: new RegExp(`^Label ${escapeRegExp(currentName)}$`, 'i') });
  await row.getByLabel(new RegExp(`^Label ${escapeRegExp(currentName)}$`, 'i')).fill(newName);
  await row.getByRole('button', { name: /^Save$/i }).click();
}

export async function toggleView(page: Page): Promise<void> {
  const listButton = page.getByRole('button', { name: /^List view$/i });
  if (await listButton.getAttribute('aria-pressed') === 'true') {
    await page.getByRole('button', { name: /^Grid view$/i }).click();
  } else {
    await page.getByRole('button', { name: /^List view$/i }).click();
  }
}

export async function expectGridView(page: Page, listView: boolean): Promise<void> {
  await expect(page.getByRole('button', { name: /^List view$/i })).toHaveAttribute('aria-pressed', String(listView));
  await expect(page.getByRole('button', { name: /^Grid view$/i })).toHaveAttribute('aria-pressed', String(!listView));
}

export async function toggleSidebar(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Toggle sidebar$/i }).click();
}
