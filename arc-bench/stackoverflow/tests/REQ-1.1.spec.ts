import { searchField, test, expect, entry, action, region, mainNav, createQuestion, displayTag, expectBrand } from './helpers';
import { retryTitle, initialEnvironment } from './fixtures/data';

// requirement: REQ-1.1

test('REQ-1.1: Show the anonymous homepage', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator',retryTitle);
  await entry(page);
  await expectBrand(page);
  await expect(searchField(page)).toBeVisible();
  for (const name of ['Products','Log in','Sign up']) await expect(action(page.getByRole('banner'), name)).toBeVisible();
  for (const name of ['Home','Questions','Tags','Users']) await expect(action(mainNav(page), name)).toBeVisible();
  const feed = region(page, 'Question feed');
  for (const name of ['Ask Question','Newest','Active']) await expect(action(feed, name)).toBeVisible();
  const summary = region(feed, `Question ${title}`);
  await expect(action(summary, title)).toBeVisible();
  for (const tag of ['node.js','http','retry']) await expect(displayTag(summary, tag)).toBeVisible();
  for (const metric of ['votes','answers','views']) await expect(summary).toContainText(new RegExp(metric, 'i'));
  const navBox=await mainNav(page).boundingBox(),summaryBox=await summary.boundingBox(),bannerBox=await page.getByRole('banner').boundingBox();
  expect(navBox).not.toBeNull();expect(summaryBox).not.toBeNull();expect(bannerBox).not.toBeNull();
  expect(navBox!.x).toBeLessThan(summaryBox!.x);expect(bannerBox!.y).toBeLessThan(summaryBox!.y);
  for (const name of initialEnvironment.widgets) {
    const widget = region(page, name);
    await expect(widget).toBeVisible();
    expect(await widget.getByRole('link').count()).toBeGreaterThan(0);
    const widgetBox=await widget.boundingBox();expect(widgetBox).not.toBeNull();expect(widgetBox!.x).toBeGreaterThan(summaryBox!.x);
  }
});
