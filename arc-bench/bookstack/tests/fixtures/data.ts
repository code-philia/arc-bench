import { randomBytes } from 'node:crypto';

/** Pure data generation only: no browser access, account provisioning or seeding. */
export interface AccountData {
  nickname: string;
  email: string;
  password: string;
}

/** Environment-provided login; account creation is not an acceptance feature. */
export const ACCOUNT: Readonly<AccountData> = Object.freeze({
  nickname: 'Admin',
  email: 'admin@example.com',
  password: 'password',
});

/** Tags use the comma-separated format accepted by the existing metadata UI. */
export interface MetadataData {
  name: string;
  description: string;
  tags: string;
}

export interface ShelfData extends MetadataData {}
export interface BookData extends MetadataData {
  shelfName?: string;
}
export interface ChapterData {
  name: string;
  description: string;
  bookName?: string;
}
export interface PageData {
  title: string;
  content: string;
  bookName?: string;
  chapterName?: string;
}
export interface DraftData extends PageData {}

export type DataOptions<T> = Partial<T> & { prefix?: string };

export function randomToken(): string {
  return randomBytes(12).toString('hex');
}

/** The supplied prefix is retained verbatim, including Chinese or punctuation. */
export function randomName(prefix = 'Item'): string {
  return `${prefix} ${randomToken()}`;
}

export function randomText(prefix = 'Content'): string {
  return `${prefix} ${randomToken()}.`;
}

export function randomTags(prefix = 'tag'): string {
  return `${prefix}-${randomToken()}, ${prefix}-${randomToken()}`;
}

/** Optional material generator; login REQs use ACCOUNT, not generated accounts. */
export function generateAccountData(options: DataOptions<AccountData> = {}): AccountData {
  const prefix = options.prefix ?? 'User';
  // Convert only the email prefix to a short ASCII-safe local part. A custom
  // nickname prefix remains unchanged; example.com is reserved for examples.
  const emailPrefix = prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'user';
  return {
    nickname: options.nickname ?? randomName(prefix),
    email: options.email ?? `${emailPrefix}-${randomToken()}@example.com`,
    password: options.password ?? `Pw9!${randomToken()}`,
  };
}

function generateMetadata(defaultPrefix: string, options: DataOptions<MetadataData>): MetadataData {
  const prefix = options.prefix ?? defaultPrefix;
  return {
    name: options.name ?? randomName(prefix),
    description: options.description ?? randomText(`${prefix} description`),
    tags: options.tags ?? randomTags(),
  };
}

export function generateShelfData(options: DataOptions<ShelfData> = {}): ShelfData {
  return generateMetadata('Shelf', options);
}

export function generateBookData(options: DataOptions<BookData> = {}): BookData {
  return {
    ...generateMetadata('Book', options),
    ...(options.shelfName === undefined ? {} : { shelfName: options.shelfName }),
  };
}

export function generateChapterData(options: DataOptions<ChapterData> = {}): ChapterData {
  const prefix = options.prefix ?? 'Chapter';
  return {
    name: options.name ?? randomName(prefix),
    description: options.description ?? randomText(`${prefix} description`),
    ...(options.bookName === undefined ? {} : { bookName: options.bookName }),
  };
}

export function generatePageData(options: DataOptions<PageData> = {}): PageData {
  const prefix = options.prefix ?? 'Page';
  return {
    title: options.title ?? randomName(prefix),
    content: options.content ?? randomText(`${prefix} content`),
    ...(options.bookName === undefined ? {} : { bookName: options.bookName }),
    ...(options.chapterName === undefined ? {} : { chapterName: options.chapterName }),
  };
}

export function generateDraftData(options: DataOptions<DraftData> = {}): DraftData {
  return generatePageData({ ...options, prefix: options.prefix ?? 'Draft' });
}

// Compatibility for existing REQs: extraction must not change their current
// names or fixed descriptions/assertions while data preparation is introduced.
const runId = randomBytes(8).toString('hex');
export function identity(info: { title: string; workerIndex: number }): string {
  const caseId = info.title.replace(/[^A-Za-z0-9]+/g, '-');
  return `${runId}-w${info.workerIndex}-${caseId}`;
}
export const named = (id: string, base: string): string => `${base} [${id}]`;
