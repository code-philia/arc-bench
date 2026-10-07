import { test, expect, entry, action, region, mainNav } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-1.1

test('REQ-1.1: Show the anonymous homepage', async ({ page, browser }, info) => {
  await entry(page);
  await expect(page.getByRole('banner')).toContainText('Stack Overflow');
  await expect(page.getByRole('banner').getByRole('searchbox', { name: 'Search', exact: true })).toBeVisible();
  for (const name of ['Products','Log in','Sign up']) await expect(action(page.getByRole('banner'), name)).toBeVisible();
  for (const name of ['Home','Questions','Tags','Users']) await expect(action(mainNav(page), name)).toBeVisible();
  const feed = region(page, 'Question feed');
  for (const name of ['Ask Question','Newest','Active']) await expect(action(feed, name)).toBeVisible();
  const summary = region(feed, `Question ${retryTitle}`);
  await expect(action(summary, retryTitle)).toBeVisible();
  for (const tag of ['node.js','http','retry']) await expect(action(summary, tag)).toBeVisible();
  for (const metric of ['votes','answers','views']) await expect(summary).toContainText(new RegExp(metric, 'i'));
  for (const name of ['The Overflow Blog','Hot Network Questions']) {
    const widget = region(page, name);
    await expect(widget).toBeVisible();
    expect(await widget.getByRole('link').count()).toBeGreaterThan(0);
  }
});
