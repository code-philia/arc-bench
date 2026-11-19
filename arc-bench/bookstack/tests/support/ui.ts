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
    .and(scope.locator('[onclick], summary'))
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
        // Confirm within this polling attempt. If the provisional scope changes
        // between observations, retry the entire priority list instead of
        // waiting indefinitely on the previously selected fallback.
        if (await candidate.count() !== 1) return false;
        selected = candidate;
        return true;
      }
    }
    return false;
  }, { message: `Find ${description}` }).toBe(true);
  if (!selected) throw new Error(`No visible ${description}`);
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
  'My Recent Drafts', 'My Recently Viewed', 'My Most Viewed Favourites', 'Recently Updated Pages',
];

/** Exclude subtrees identified as a different business object. A generic
 * Actions label never overrides a child object's own heading/caption. */
function ownedBy(scope: Scope, candidates: Locator, ownerName: string, itemName?: Name): Locator {
  const allowed = [ownerName, ...(typeof itemName === 'string' ? [itemName] : []), ...COLLECTION_NAMES, 'Actions', 'Details', 'Description', 'Content', 'Body', 'Tags', 'Draft'];
  const except = `:not(:text-matches(${JSON.stringify(`^(?:${allowed.map(escaped).join('|')})$`)}))`;
  const recordContents = ['li *', 'tr *', '[role="listitem"] *', '[role="row"] *', ...COLLECTION_NAMES.map(value => `[aria-label=${JSON.stringify(value)}] *`)].join(',');
  const heading = `:is(h1,h2,h3,h4,h5,h6,[role="heading"])${except}:not(${recordContents})`;
  const container = `:is(section,article,div,aside,li,tr,[role="listitem"],[role="row"]):not(:has(:text-is(${JSON.stringify(ownerName)})))`;
  const foreignHeading = `${container}:has(${heading})`;
  // Plain captions are object evidence when paired with interactions, not
  // when they are merely spans within the current object's prose.
  const caption = `span:not([aria-hidden="true"], [hidden], [role="presentation"], [role="none"]):visible:text-matches(${JSON.stringify(String.raw`\S`)})${except}`;
  const foreignCaption = `${container}:has(> ${caption}):has(button,a,[role="button"],[role="link"],[onclick])`;
  return candidates.and(scope.locator(`:not(${foreignHeading}, ${foreignHeading} *, ${foreignCaption}, ${foreignCaption} *)`));
}

/** Named collections can be siblings of the selected object's detail card.
 * Keep all equivalent group paths together so mixed markup cannot hide a
 * second collection. This supplies collection evidence, never item identity. */
function namedCollectionGroups(scope: Scope, aliases: string[]): Locator {
  const name = new RegExp(`^(?:${aliases.map(escaped).join('|')})$`);
  const title = scope.getByText(name, { exact: true })
    .and(scope.locator(':not(a, button, a *, button *, nav *, header *, [role="navigation"] *, [role="banner"] *)'))
    .filter({ visible: true });
  const label = aliases.map(alias => `[aria-label=${JSON.stringify(alias)}]`).join(', ');
  let groups = scope.getByRole('region', { name })
    .or(scope.getByRole('list', { name }))
    .or(scope.getByRole('group', { name }))
    .or(scope.getByRole('table', { name }))
    .or(scope.locator('section, article, div, ul, ol, table').and(scope.locator(label)))
    .or(title.locator('xpath=ancestor::*[self::section or self::article][1]'))
    .or(title.locator('xpath=ancestor::div[descendant::ul or descendant::ol or descendant::table or descendant::*[@role="list"]][1]'))
    .or(title.locator('xpath=ancestor::div[count(*) > 1][1]'));
  for (const other of COLLECTION_NAMES) {
    if (!aliases.includes(other)) groups = groups.filter({ hasNot: scope.getByText(other, { exact: true }) });
  }
  return groups.and(scope.locator(':not(aside, aside *, nav, nav *, header, header *, [role="complementary"], [role="complementary"] *, [role="navigation"] *, [role="banner"] *)'))
    .filter({ visible: true });
}

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
    const groups = ownedBy(page, namedCollectionGroups(page, aliases), contextTitle);
    const main = visible(owner.locator('xpath=ancestor::*[self::main or @role="main"][1]'));
    // A main is a hard upper boundary: another main, header or sidebar must
    // not supply a missing collection. Without main, require an enclosing
    // content layout containing both the owner and positive group evidence.
    const hasMain = await main.count() > 0;
    if (!hasMain) {
      // If the nearest existing content boundary already contains exactly one
      // owned collection, every smaller qualifying layout can only select that
      // same collection. Avoid inferring and embedding a larger layout again.
      // Zero or multiple groups retain the full sibling-layout inference.
      const local = smallestContainers(groups).and(boundary.locator('*'));
      if (await local.count() === 1) {
        return resolveUnique([local], `collection ${name} owned by ${contextTitle}`);
      }
    }
    const layout = hasMain ? main : smallestContainers(
      visible(page.locator('section, article, div')).filter({ has: owner })
        .filter({ has: groups }),
    );
    if (await layout.count() === 1) {
      // Prune nested aliases before intersecting the layout. Descendants of
      // a group inside this layout cannot escape it; factoring the intersection
      // avoids re-evaluating the entire owner/layout search inside each group.
      const related = smallestContainers(groups).and(layout.locator('*'));
      if (await related.count() > 0) {
        return resolveUnique([related], `collection ${name} owned by ${contextTitle}`);
      }
    }
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
  const candidates = [
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
  ];
  return resolveUnique(contextTitle ? candidates.map(value => ownedBy(page, value, contextTitle)) : candidates, `collection ${name}`);
}

async function visibleTitle(page: Page, name: string): Promise<Locator> {
  const detailOnly = page.locator(`:not(li, li *, tr, tr *, [role="listitem"], [role="listitem"] *, [role="row"], [role="row"] *, ${COLLECTION_NAMES.map(value => `[aria-label=${JSON.stringify(value)}] *`).join(',')})`);
  // A collection's own page heading may live in its named card. Record
  // headings and opening labels remain excluded, including nested record cards.
  const aliases = Object.values(COLLECTION_ALIASES).find(values => values.includes(name));
  const labels = (aliases ?? []).map(value => `[aria-label=${JSON.stringify(value)}]`);
  const record = 'li, tr, [role="listitem"], [role="row"], a, button, [role="link"], [role="button"]';
  const nestedCards = labels.flatMap(label => [`${label} article *`, `${label} section *`]);
  const ownCollectionHeading = labels.length
    ? page.getByRole('heading', { name, exact: true })
      .and(page.locator(labels.map(label => `${label} *`).join(',')))
      .and(page.locator(`:not(${record}, ${record.split(', ').map(value => value + ' *').join(',')}, ${nestedCards.join(',')})`))
    : page.locator(':not(*)');
  return resolveUnique([
    page.getByRole('heading', { name, exact: true }).and(detailOnly).or(ownCollectionHeading).filter({ visible: true }),
    page.getByText(name, { exact: true })
      .and(page.locator(':not(a, button, input, nav *, header *, [role="navigation"] *, [role="banner"] *, [role="link"], [role="button"])'))
      .and(detailOnly).filter({ visible: true }),
  ], `title ${name}`);
}

export async function heading(page: Page, name: string): Promise<void> {
  const title = await visibleTitle(page, name);
  await expect(title).toBeVisible();
}

/** Native and custom editable fields can have different implicit roles. */
export function field(scope: Scope, name: string): Locator {
  // REQ-6.1/6.4 specify editor purposes, not literal field labels. Other
  // fields (Email, Password, Name, Description, Tags) have prescribed copy.
  const purposeLabel = ['Page title', 'Page content', 'Write your page content here...'].includes(name);
  const aliases = name === 'Page title' ? ['Page title', 'Title']
    : name === 'Page content' || name === 'Write your page content here...'
      ? ['Page content', 'Content', 'Body', 'Write your page content here...'] : [name];
  const label = new RegExp(`^\\s*(?:\\*\\s*)?(?:${aliases.map(escaped).join('|')})\\s*(?:\\*)?\\s*$`, purposeLabel ? 'i' : '');
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
  await expect(entry(page, favorited ? 'Unfavorite' : 'Favourite')).toBeVisible();
  await expect(entry(page, favorited ? 'Favourite' : 'Unfavorite')).toHaveCount(0);
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
    async openWithKeyboard() { const node = await countedTarget(target, 1); await node.focus(); await node.press('Enter'); },
  };
}

export function action(scope: Scope, name: Name) {
  const target = name === 'Create New Book' || name === 'New Book' ? /^(?:Create New Book|New Book)$/ : name;
  return actionable(() => entry(scope, target));
}

export function actionControl(control: Locator) { return actionable(() => control); }

/** Collapse nested layout wrappers, not competing sibling business areas. */
function smallestContainers(containers: Locator): Locator {
  return containers.filter({ hasNot: containers });
}

/** Book actions belong to the detail view, never to one of its page rows. */
export function bookActions(page: Page, bookName: string) {
  const target = async (name: Name) => {
    const owner = await visibleTitle(page, bookName);
    const layout = page.locator('body, main, section, article, aside, div, [role="main"], [role="region"], [role="group"], [role="toolbar"]');
    const named = page.getByRole('complementary', { name: 'Actions', exact: true })
      .or(page.getByRole('region', { name: 'Actions', exact: true }))
      .or(page.getByRole('group', { name: 'Actions', exact: true }))
      .or(page.getByRole('toolbar', { name: 'Actions', exact: true }));
    const controls = entry(page, name).and(page.locator(':not(nav *, header *, [role="navigation"] *, [role="banner"] *)'));
    const labelled = smallestContainers(layout.filter({ has: page.getByText('Actions', { exact: true }) })
      .filter({ has: controls })).or(named).filter({ visible: true });
    // Explicit action groups may themselves use lists. Outside them, list/row
    // controls belong to child content, not to the selected book.
    // Intersect the already identified controls with the group once instead
    // of copying the entire group query into every action-role alternative.
    const grouped = controls.and(labelled.locator('*'));
    const standalone = controls.and(page.locator(':not(li *, tr *, [role="listitem"] *, [role="row"] *, ul *, ol *, table *, [role="list"] *, [aria-label="Page list"] *, [aria-label="Chapter list"] *)'));
    const eligible = grouped.or(standalone);
    // Filter child ownership before uniqueness; Actions does not establish owner.
    return ownedBy(page, eligible, bookName);
  };
  return { action(name: Name) { return actionable(() => target(name)); } };
}

/** A confirmation must identify the object whose operation was requested. */
export function deletionConfirmation(page: Page, ownerName: string) {
  const target = async () => {
    const identity = page.getByText(new RegExp(escaped(ownerName)))
      .and(page.locator(':not(a,button,input,textarea,h1,h2,h3,h4,h5,h6,[role="heading"],nav *,header *,a *,button *)')).filter({ visible: true });
    const message = page.getByText(/\S/).and(page.locator(':not(a,button,input,textarea,h1,h2,h3,h4,h5,h6,[role="heading"],nav *,header *,a *,button *)')).filter({ visible: true });
    const scopes = page.locator('section,article,form,div,[role="dialog"],[role="alertdialog"]')
      .filter({ has: message }).filter({ has: entry(page, 'Confirm') }).filter({ has: entry(page, 'Cancel') })
      .filter({ visible: true });
    return resolveUnique([smallestContainers(scopes).filter({ has: identity })], `deletion confirmation for ${ownerName}`);
  };
  return { ...observable(target), action(name: 'Confirm' | 'Cancel') { return actionable(async () => entry(page, name).and((await target()).locator('*'))); } };
}

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
    async displayedNames(): Promise<string[]> {
      const scope=await target();
      const names=await scope.evaluate(root=>{
        const shown=(el:Element)=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
        const controls=[...root.querySelectorAll('a,button,[role="link"],[role="button"]')].filter(shown);
        const result:string[]=[];
        for(const control of controls){
          const text=(control.textContent||'').trim();
          if(/^(?:View All|See All|Edit|Delete|Favourite|Unfavorite)$/i.test(text))continue;
          const row=control.closest('li,article,tr,[role="listitem"]');
          const headings=[...(row||control).querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(shown);
          if(headings.length>1)throw new Error('Favorite row contains ambiguous captions');
          let caption=headings[0]?.textContent?.trim();
          if(!caption&&/^(?:Open|View|Read)$/.test(text)){
            if(!row)throw new Error('Generic favorite action has no record owner');
            const captions=[...row.querySelectorAll(':scope > span,:scope > p')].filter(shown);
            if(captions.length!==1)throw new Error('Generic favorite action requires one readable caption');
            caption=captions[0].textContent?.trim();
          }
          caption=caption||text.replace(/^(?:Open|View|Read)\s+/,'');
          if(!caption)throw new Error('Favorite entry has no readable identity');
          result.push(caption);
        }
        if(new Set(result).size!==result.length)throw new Error('Duplicate favorite identities');
        return result;
      });
      for(const name of names)await expect(itemEntry(page,name).and(scope.locator('*'))).toHaveCount(1);
      return names;
    },
    async visibleNames(names: string[]): Promise<string[]> {
      const scope = await target();
      const visible: string[] = [];
      for (const name of new Set(names)) {
        const count = await itemEntry(page, name).and(scope.locator('*')).count();
        if (count > 1) throw new Error(`Duplicate opening identity ${name}`);
        if (count === 1) visible.push(name);
      }
      return visible;
    },
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
          const controls = [...root.querySelectorAll('a, button, [role="link"], [role="button"]')]
            .filter(node => visible(node) && !/^(?:view all|see all|edit|delete|favourite|unfavorite)$/i.test(node.textContent?.trim() ?? ''));
          const extra = controls.filter(node => !records.some(record => record.contains(node)))
            .filter(node => !controls.some(other => other !== node && other.contains(node)));
          if (records.length || extra.length) return records.length + extra.length;
          const text = root.textContent?.trim() ?? '';
          if (root.querySelector('ul, ol, tbody, [role="list"]') && !text) return 0;
          throw new Error('Collection has no countable records; do not assume an empty list');
        });
      }, { message: `${name} contains at most ${maximum} records` }).toBeLessThanOrEqual(maximum);
    },
    item(itemName: Name) { return actionable(async () => {
      const scope = await target();
      const entries = itemEntry(page, itemName).and(scope.locator('*'));
      return options.owner ? ownedBy(page, entries, options.owner, itemName) : entries;
    }); },
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
    const forms = hasCredentials(page.locator('form')).filter({ visible: true });
    const controls = entry(page, 'Sign in').and(page.locator(':not(nav *, header *, [role="navigation"] *, [role="banner"] *)'));
    const layouts = hasCredentials(page.locator('body, main, section, article, div, [role="dialog"], [role="group"]'))
      .filter({ has: controls }).filter({ visible: true });
    // A real credentials form is authoritative: duplicate submits/forms must
    // not be bypassed via a smaller div. Generic layout is an alternative only
    // when no such form exists, and does not require ARIA or password type.
    const nativeForm = await forms.count() > 0;
    const form = await resolveUnique([nativeForm ? forms : smallestContainers(layouts)], 'login form');
    await expect(field(form, 'Email')).toHaveCount(1);
    await expect(field(form, 'Password')).toHaveCount(1);
    const id = await form.getAttribute('id');
    const associated = id && await form.evaluate(node => node.tagName === 'FORM')
      ? controls.and(page.locator(`button[form=${JSON.stringify(id)}], input[form=${JSON.stringify(id)}]`))
      : page.locator(':not(*)');
    return nativeForm ? entry(form, 'Sign in').or(associated) : controls;
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
    return ownedBy(page, scope.getByText(value, { exact: true })
      .and(page.locator(':not(a, button, input, textarea, [contenteditable="true"], [contenteditable="true"] *, [role="textbox"], [role="textbox"] *, a *, button *, aside *, nav *, header *, [role="complementary"] *, [role="navigation"] *)'))
      .filter({ visible: true }), ownerName);
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
      const unselected = entry(page, 'Favourite');
      await expect(selected.or(unselected)).toHaveCount(1);
      return await selected.count() === 1;
    },
    async set(selected: boolean) {
      if (await this.read() !== selected) await action(page, selected ? 'Favourite' : 'Unfavorite').activate();
      await this.expectState(selected);
    },
  };
}
