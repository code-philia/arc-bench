import { createHash } from 'node:crypto';
import { expect, test as base, type Page, type Locator, type Browser, type TestInfo } from '@playwright/test';
import { accounts, password, body, answerBody, commentBody } from './fixtures/data';
export { expect };
// Only freeze the business clock. Keep native timers, performance and animation
// frames running so browser actionability checks and context teardown can finish.
export async function freezeClock(page: Page, instant: string) {
  await page.addInitScript(({ milliseconds }) => {
    const NativeDate = Date;
    globalThis.Date = new Proxy(NativeDate, {
      construct(target, args) {
        return Reflect.construct(target, args.length ? args : [milliseconds]);
      },
      apply() {
        return new NativeDate(milliseconds).toString();
      },
      get(target, property, receiver) {
        if (property === 'now') return () => milliseconds;
        return Reflect.get(target, property, receiver);
      },
    });
  }, { milliseconds: Date.parse(instant) });
}
export const test = base.extend({
  page: async ({ page }, use) => {
    const instant = base.info().project.name === 'expired-comment' ? '2026-07-21T12:06:00Z' : '2026-07-21T12:02:00Z';
    await freezeClock(page, instant);
    await use(page);
  },
});
export type Account = keyof typeof accounts;
export const region = (scope: Page | Locator, name: string) => scope.getByRole('region', { name, exact: true });
export const action = (scope: Page | Locator, name: string) => scope.getByRole('button', { name, exact: true }).or(scope.getByRole('link', { name, exact: true }));
export const field = (scope: Page | Locator, name: string) => scope.getByLabel(name, { exact: true });
export const mainNav = (page: Page) => page.getByRole('navigation', { name: 'Main navigation', exact: true });
export const profileNav = (page: Page) => page.getByRole('navigation', { name: 'Profile navigation', exact: true });
export const activityNav = (page: Page) => page.getByRole('navigation', { name: 'Activity navigation', exact: true });
export const post = (page: Page) => region(page, 'Question post');
export const answer = (page: Page, author = 'Helpful User') => region(region(page, 'Answers'), `Answer by ${author}`);
export const comment = (scope: Page | Locator, text = commentBody) => region(region(scope, 'Comments'), `Comment ${text}`);
export const output = (scope: Page | Locator, name: string) => scope.getByRole('status', { name, exact: true });
export async function entry(page: Page) { await page.goto('/'); }
export async function openLogin(page: Page) {
  await entry(page);
  await action(page.getByRole('banner'), 'Log in').click();
  return region(page, 'Log in');
}
export async function login(page: Page, account: Account) {
  const form = await openLogin(page);
  await field(form, 'Email').fill(accounts[account]);
  await field(form, 'Password').fill(password);
  await action(form, 'Log in').click();
  await expect(region(page, 'Question feed')).toBeVisible();
  await expect(action(page.getByRole('banner'), account === 'helpful_user' ? 'Helpful User' : 'Stack User')).toBeVisible();
}
export async function openQuestion(page: Page, title: string) {
  await action(mainNav(page), 'Questions').click();
  // Public Search is used rather than assuming the question is on page one.
  await page.getByRole('banner').getByRole('searchbox', { name: 'Search', exact: true }).fill(title);
  await page.getByRole('banner').getByRole('searchbox', { name: 'Search', exact: true }).press('Enter');
  await action(region(page, 'Search results'), title).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(post(page)).toBeVisible();
}
export async function ownProfile(page: Page, name = 'Stack User') {
  await action(page.getByRole('banner'), name).click();
  await expect(profileNav(page)).toBeVisible();
}
export async function activity(page: Page, category: string) {
  await ownProfile(page);
  await action(profileNav(page), 'Activity').click();
  await action(activityNav(page), category).click();
  return region(page, 'Activity content');
}
export function suffix(info: TestInfo) {
  const run = process.env.SO_RUN_ID;
  if (!run || !/^[a-zA-Z0-9-]{1,20}$/.test(run)) throw new Error('SO_RUN_ID must be 1–20 letters, digits or hyphens.');
  const slug = createHash('sha256').update(info.title).digest('hex').slice(0, 10);
  return `${run}-${info.parallelIndex}-${slug}`;
}
export function titleFor(info: TestInfo, stem: string) { return `${stem} ${suffix(info)}`; }
export async function composeQuestion(page: Page, title: string, text = body, tags = 'node.js,http,retry') {
  await action(region(page, 'Question feed'), 'Ask Question').click();
  await field(page, 'Title').fill(title);
  await field(page, 'Body').fill(text);
  await field(page, 'Tags').fill(tags);
  await action(page, 'Post Your Question').click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
}
export async function publishAnswer(page: Page, text = answerBody) {
  await field(page, 'Your Answer').fill(text);
  await action(page, 'Post Your Answer').click();
  await expect(region(page, 'Answers').getByText(text, { exact: true })).toBeVisible();
}
export async function publishComment(scope: Locator, text = commentBody) {
  await action(scope, 'Add a comment').click();
  await field(scope, 'Comment').fill(text);
  await field(scope, 'Comment').press('Enter');
  await expect(comment(scope, text)).toBeVisible();
}
export async function asUser(browser: Browser, account: Account, use: (page: Page) => Promise<void>) {
  const context = await browser.newContext({ baseURL: process.env.SO_BASE_URL, timezoneId: 'UTC' });
  try {
    const page = await context.newPage();
    await freezeClock(page, '2026-07-21T12:02:00Z');
    await login(page, account);
    await use(page);
  } finally { await context.close(); }
}
export async function createQuestion(browser: Browser, info: TestInfo, owner: Account, stem: string) {
  const title = titleFor(info, stem);
  await asUser(browser, owner, page => composeQuestion(page, title));
  return title;
}
export async function createAnswer(browser: Browser, title: string, author: Account = 'helpful_user', text = answerBody) {
  await asUser(browser, author, async page => { await openQuestion(page, title); await publishAnswer(page, text); });
}
export async function createComment(browser: Browser, title: string, author: Account, text = commentBody) {
  await asUser(browser, author, async page => { await openQuestion(page, title); await publishComment(post(page), text); });
}
export async function numeric(scope: Page | Locator, name: string) {
  const value = (await output(scope, name).innerText()).trim();
  if (!/^-?\d+$/.test(value)) throw new Error(`Expected visible integer ${name}, received ${value}`);
  return Number(value);
}
export async function expectNumeric(scope: Page | Locator, name: string, value: number) {
  await expect(output(scope, name)).toHaveText(String(value));
}
export async function beforeText(scope: Locator, firstIdentity: string, secondIdentity: string) {
  await expect.poll(async () => {
    const text = await scope.innerText();
    const a = text.indexOf(firstIdentity), b = text.indexOf(secondIdentity);
    return a >= 0 && b >= 0 && a < b;
  }).toBe(true);
}
export async function confirmDeletion(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Confirm deletion', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/delet|remov/i);
  await action(dialog, 'Confirm deletion').click();
}

export async function noUsableAction(scope: Page | Locator, name: string) {
  const controls = action(scope, name).filter({ visible: true });
  // A hidden action or a visibly disabled action is unavailable to the user.
  for (const control of await controls.all()) await expect(control).toBeDisabled();
}
