import { expect, type Locator, type Page } from '@playwright/test';

type Scope = Page | Locator;
type Name = string | RegExp;

function escaped(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

const COLLECTION_ALIASES: Record<string, string[]> = {
  'Shelf list': ['Shelf list', 'Shelves'],
  'Book list': ['Book list', 'Books'],
  'Page list': ['Page list', 'Pages'],
  'Chapter list': ['Chapter list', 'Chapters'],
};

/** Match controls by purpose; static text alone is not an opening action. */
export function entry(scope: Scope, name: Name): Locator {
  const semantic = scope.getByRole('button', { name, exact: true })
    .or(scope.getByRole('link', { name, exact: true }))
    .or(scope.getByRole('menuitem', { name, exact: true }))
    .or(scope.getByRole('tab', { name, exact: true }));
  const custom = scope.getByText(name, { exact: true })
    .and(scope.locator('[onclick], [tabindex], summary'))
    // Do not count an inner text node separately from its semantic control.
    .and(scope.locator(':not(button *, a *, [role="button"] *, [role="link"] *, [role="menuitem"] *, [role="tab"] *)'));
  return semantic.or(custom).filter({ visible: true });
}

export const button = entry;

/** Prefer a meaningful scope, and fail on ambiguity instead of picking DOM order. */
async function resolveUnique(candidates: Locator[], description: string): Promise<Locator> {
  let selected: Locator | undefined;
  await expect.poll(async () => {
    for (const candidate of candidates) {
      const count = await candidate.count();
      if (count > 1) return false;
      if (count === 1) {
        selected = candidate;
        return true;
      }
    }
    return false;
  }, { message: `Find ${description}` }).toBe(true);
  if (!selected) throw new Error(`No visible ${description}`);
  // Keep the chosen locator across a render transition; the count assertion
  // waits for it to reappear rather than failing in a second snapshot loop.
  await expect(selected, `Unambiguous ${description}`).toHaveCount(1);
  return selected;
}

export async function navigationEntry(page: Page, name: string): Promise<Locator> {
  const hasPublicEntries = (container: Locator) => container
    .filter({ has: entry(page, 'Shelves') })
    .filter({ has: entry(page, 'Books') })
    .filter({ visible: true });
  const navigation = hasPublicEntries(page.getByRole('navigation'));
  const header = hasPublicEntries(page.getByRole('banner').or(page.locator('header')));
  return resolveUnique([
    entry(navigation, name), entry(header, name), entry(page, name),
  ], `public navigation entry ${name}`);
}

const COLLECTION_NAMES = [
  ...Object.values(COLLECTION_ALIASES).flat(),
  'My Recent Drafts', 'My Recently Viewed', 'My Most Viewed Favorites', 'Recently Updated Pages',
];

/** Locate a business collection; it need not have the ARIA region role. */
export async function region(page: Page, name: string, contextTitle?: string): Promise<Locator> {
  const visible = (value: Locator) => value.filter({ visible: true });
  const aliases = COLLECTION_ALIASES[name] ?? [name];
  const collectionName = new RegExp(`^(?:${aliases.map(escaped).join('|')})$`);
  let boundary: Locator | undefined;
  if (contextTitle) {
    const owner = await visibleTitle(page, contextTitle);
    boundary = await resolveUnique([
      visible(owner.locator('xpath=ancestor::*[self::section or self::article or self::main or (self::div and (descendant::ul or descendant::ol or descendant::table))][1]')),
    ], `content owned by ${contextTitle}`);
  }
  const scope = boundary ?? page;
  const title = visible(scope.getByText(collectionName, { exact: true })
    .and(scope.locator(':not(a, button, a *, button *, nav *, header *, [role="navigation"] *, [role="banner"] *)')));
  const label = aliases.map(alias => `[aria-label=${JSON.stringify(alias)}]`).join(', ');
  // Avoid treating the whole dashboard as one collection when using headings.
  const excludeOtherCollections = (value: Locator) => {
    for (const other of COLLECTION_NAMES) {
      if (!aliases.includes(other)) value = value.filter({ hasNot: page.getByText(other, { exact: true }) });
    }
    return visible(value);
  };
  const nativeGroup = title.locator('xpath=ancestor::*[self::section or self::article or self::aside][1]');
  const cardWithList = title.locator('xpath=ancestor::div[descendant::ul or descendant::ol or descendant::table or descendant::*[@role="list"]][1]');
  const emptyCard = title.locator('xpath=ancestor::div[count(*) > 1][1]');
  const context = boundary && ['Book list', 'Page list', 'Chapter list'].includes(name) ? [boundary] : [];
  return resolveUnique([
    visible(scope.getByRole('region', { name: collectionName })),
    visible(scope.getByRole('list', { name: collectionName })
      .or(scope.getByRole('group', { name: collectionName }))
      .or(scope.getByRole('table', { name: collectionName }))
      .or(scope.getByRole('complementary', { name: collectionName }))),
    visible(scope.locator('section, article, aside, div, ul, ol, table').and(scope.locator(label))),
    excludeOtherCollections(nativeGroup),
    excludeOtherCollections(cardWithList),
    excludeOtherCollections(emptyCard),
    ...context,
  ], `collection ${name}`);
}

async function visibleTitle(page: Page, name: string): Promise<Locator> {
  return resolveUnique([
    page.getByRole('heading', { name, exact: true }).filter({ visible: true }),
    page.getByText(name, { exact: true })
      .and(page.locator(':not(a, button, input, nav *, header *, [role="navigation"] *, [role="banner"] *, [role="link"], [role="button"])'))
      .filter({ visible: true }),
  ], `title ${name}`);
}

export async function heading(page: Page, name: string): Promise<void> {
  const title = await visibleTitle(page, name);
  await expect(title).toBeVisible();
}

/** Native and custom editable fields can have different implicit roles. */
export function field(scope: Scope, name: string): Locator {
  const aliases = name === 'Page title' ? ['Page title', 'Title']
    : name === 'Page content' || name === 'Write your page content here...'
      ? ['Page content', 'Content', 'Body', 'Write your page content here...'] : [name];
  const label = new RegExp(`^\\s*(?:\\*\\s*)?(?:${aliases.map(escaped).join('|')})\\s*(?:\\*)?\\s*$`);
  // Union all supported labels/placeholders: competing fields remain ambiguous.
  return scope.getByLabel(label).or(scope.getByPlaceholder(label))
    .and(scope.locator('input, textarea, [contenteditable="true"]'))
    .filter({ visible: true });
}

export async function readField(control: Locator): Promise<string> {
  const tag = await control.evaluate(element => element.tagName.toLowerCase());
  if (tag === 'input' || tag === 'textarea') return control.inputValue();
  // Chromium may leave a lone <br> in an emptied contenteditable field.
  // Treat that empty editor as empty, without trimming meaningful user text.
  if (await control.textContent() === '') return '';
  return control.innerText();
}

export async function expectFieldValue(page: Page, name: string, value: string): Promise<void> {
  await expect.poll(() => readField(field(page, name))).toBe(value);
}

async function toggleControl(page: Page, name: string): Promise<Locator> {
  return resolveUnique([
    page.getByLabel(name, { exact: true }).and(page.locator('input[type="checkbox"], input[type="radio"]')).filter({ visible: true }),
    page.getByRole('checkbox', { name, exact: true }).or(page.getByRole('switch', { name, exact: true })).filter({ visible: true }),
    entry(page, name),
  ], `toggle ${name}`);
}

async function readToggle(control: Locator): Promise<boolean> {
  const type = await control.getAttribute('type');
  if (type === 'checkbox' || type === 'radio') return control.isChecked();
  for (const attribute of ['aria-checked', 'aria-pressed', 'data-state']) {
    const value = await control.getAttribute(attribute);
    if (value === 'true' || value === 'checked' || value === 'on') return true;
    if (value === 'false' || value === 'unchecked' || value === 'off') return false;
  }
  throw new Error('Toggle has no readable selected state; do not assume unchecked.');
}

export async function expectToggleState(page: Page, name: string, selected: boolean): Promise<void> {
  const control = await toggleControl(page, name);
  await expect.poll(() => readToggle(control)).toBe(selected);
}

export async function setToggle(page: Page, name: string, selected: boolean): Promise<void> {
  const control = await toggleControl(page, name);
  if (await readToggle(control) !== selected) await control.click();
  await expect.poll(() => readToggle(control)).toBe(selected);
}

/** The product communicates favorite state via its available action label. */
export async function expectFavoriteState(page: Page, favorited: boolean): Promise<void> {
  await expect(entry(page, favorited ? 'Unfavorite' : 'Favorite')).toBeVisible();
  await expect(entry(page, favorited ? 'Favorite' : 'Unfavorite')).toHaveCount(0);
}

// Semantic interfaces deliberately do not expose Locator or inputValue().
type Target = () => Locator | Promise<Locator>;

async function countedTarget(target: Target, count: number): Promise<Locator> {
  let node: Locator | undefined;
  // Re-evaluate scope choices while a view loads; a provisional title container
  // may be replaced by a correctly named collection after the request returns.
  await expect.poll(async () => { node = await target(); return node.count(); }).toBe(count);
  if (!node) throw new Error('Target was not resolved');
  return node;
}

function observable(target: Target) {
  return {
    async expectVisible() { await expect(await countedTarget(target, 1)).toBeVisible(); },
    async expectCount(count: number) { await countedTarget(target, count); },
    async expectAbsent() { await countedTarget(target, 0); },
  };
}

function actionable(target: Target) {
  return {
    ...observable(target),
    async activate() { await (await countedTarget(target, 1)).click(); },
    async open() { await (await countedTarget(target, 1)).click(); },
  };
}

export function action(scope: Scope, name: Name) {
  const target = name === 'Create New Book' || name === 'New Book' ? /^(?:Create New Book|New Book)$/ : name;
  return actionable(() => entry(scope, target));
}

export function actionControl(control: Locator) { return actionable(() => control); }

export function navigationAction(page: Page, name: string) {
  return actionable(() => navigationEntry(page, name));
}

/** Adapter entry for composite fields such as indexed tag editor rows. */
export function editableControl(control: Locator) {
  const target = async () => {
    await expect(control).toHaveCount(1);
    await expect(control).toBeVisible();
    return control;
  };
  return {
    ...observable(target),
    async fill(value: string) { await (await target()).fill(value); },
    async read() { return readField(await target()); },
    async expectValue(value: string) { await expect.poll(async () => readField(await target())).toBe(value); },
  };
}

export function textField(scope: Scope, name: string) {
  return editableControl(field(scope, name));
}

/** Editor purpose is independent of its placeholder copy. */
export function pageEditor(scope: Scope) {
  return { title: textField(scope, 'Page title'), body: textField(scope, 'Page content') };
}

/** Match exact object identity, allowing a bounded opening label or card wrapper. */
export function itemEntry(scope: Scope, name: Name): Locator {
  if (typeof name !== 'string') return entry(scope, name);
  const openingName = new RegExp(`^(?:(?:[Oo]pen|[Vv]iew|[Rr]ead)\\s+)?${escaped(name)}$`);
  const identity = scope.getByText(name, { exact: true }).filter({ visible: true });
  // A linked card may include description text in its accessible name.
  const cardName = new RegExp(`^(?:(?:[Oo]pen|[Vv]iew|[Rr]ead)\\s+)?${escaped(name)}(?:\\s+[\\s\\S]+)?$`);
  const wrapped = identity.locator('xpath=ancestor::*[self::a or self::button or @role="link" or @role="button" or @role="menuitem" or @role="tab"][1]')
    .and(entry(scope, cardName));
  // Separate generic open actions must be in the same explicit card/list row.
  const cards = identity.locator('xpath=ancestor::*[self::article or self::li or self::tr or @role="listitem"][1]')
    .and(scope.locator('article, li, tr, [role="listitem"]'));
  return entry(scope, openingName).or(wrapped).or(entry(cards, /^(?:Open|View|Read)$/)).filter({ visible: true });
}

export function objectNavigation(scope: Scope, name: string) {
  return actionable(() => itemEntry(scope, name));
}

export function collection(page: Page, name: string, options: { owner?: string } = {}) {
  const target = () => region(page, name, options.owner);
  return {
    ...observable(target),
    async expectMaxItems(maximum: number) {
      await expect.poll(async () => {
        const scope = await target();
        return scope.evaluate(root => {
          const visible = (node: Element) => node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden';
          const selector = 'li, [role="listitem"], tbody > tr, article';
          // Count outer records, not nested controls or nested lists within a record.
          const records = [...root.querySelectorAll(selector)].filter(node => {
            if (!visible(node)) return false;
            const ancestor = node.parentElement?.closest(selector);
            return !ancestor || ancestor === root || !root.contains(ancestor);
          });
          if (records.length) return records.length;
          const controls = [...root.querySelectorAll('a, button, [role="link"], [role="button"]')]
            .filter(node => visible(node) && !/^(?:view all|see all)$/i.test(node.textContent?.trim() ?? ''));
          if (controls.length) return controls.length;
          if (root.querySelector('ul, ol, tbody, [role="list"]')) return 0;
          throw new Error('Collection has no countable records; do not assume an empty list');
        });
      }, { message: `${name} contains at most ${maximum} records` }).toBeLessThanOrEqual(maximum);
    },
    item(itemName: Name) { return actionable(async () => itemEntry(await target(), itemName)); },
  };
}

export function title(page: Page, name: string) {
  return observable(() => visibleTitle(page, name));
}

export function content(scope: Scope, value: string) {
  return observable(() => scope.getByText(value, { exact: true }).filter({ visible: true }));
}

/** Authentication is observed in the user/header area, independently of dashboard features. */
export function accountIdentity(page: Page, nickname: string) {
  return observable(() => page.getByRole('banner').or(page.locator('header'))
    .getByText(nickname, { exact: true }).filter({ visible: true }));
}

export function loginSubmit(page: Page) {
  return actionable(async () => {
    const hasCredentials = (scope: Locator) => scope.filter({ has: field(page, 'Email') }).filter({ has: field(page, 'Password') });
    const form = await resolveUnique([
      hasCredentials(page.locator('form')),
      hasCredentials(page.locator('section, article, [role="dialog"]')),
      hasCredentials(field(page, 'Email').locator('xpath=ancestor::div[descendant::input[@type="password"]][1]')),
    ], 'login form');
    return entry(form, 'Login');
  });
}

/** Bound content to the selected object's reading/details card, excluding sidebars and controls. */
export function detailContent(page: Page, ownerName: string, value: string) {
  return observable(async () => {
    const owner = await visibleTitle(page, ownerName);
    const scope = await resolveUnique([
      owner.locator('xpath=ancestor::*[self::article or self::section][1]').filter({ visible: true }),
      owner.locator('xpath=ancestor::div[count(*) > 1][1]').filter({ visible: true }),
    ], `details card for ${ownerName}`);
    return scope.getByText(value, { exact: true })
      .and(page.locator(':not(a, button, input, textarea, [contenteditable="true"], [contenteditable="true"] *, [role="textbox"], [role="textbox"] *, a *, button *, aside *, nav *, header *, [role="complementary"] *, [role="navigation"] *)'))
      .filter({ visible: true });
  });
}

export function toggle(page: Page, name: string) {
  return {
    ...observable(() => toggleControl(page, name)),
    async read() { return readToggle(await toggleControl(page, name)); },
    async set(selected: boolean) { await setToggle(page, name, selected); },
    async expectState(selected: boolean) { await expectToggleState(page, name, selected); },
  };
}

export function favorite(page: Page) {
  return {
    async expectState(selected: boolean) { await expectFavoriteState(page, selected); },
    async read() {
      const selected = entry(page, 'Unfavorite');
      const unselected = entry(page, 'Favorite');
      await expect(selected.or(unselected)).toHaveCount(1);
      return await selected.count() === 1;
    },
    async set(selected: boolean) {
      if (await this.read() !== selected) await action(page, selected ? 'Favorite' : 'Unfavorite').activate();
      await this.expectState(selected);
    },
  };
}
