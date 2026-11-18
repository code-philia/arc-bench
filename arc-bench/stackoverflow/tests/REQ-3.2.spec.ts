import { expectDisplayedTag,test, expect, login, openQuestion, action, region, post, output, expectNumeric, numeric, expectBody, displayTag, expectAuthorBadges, prepareReadingQuestion, noUsableAction, mainNav, utcDatePattern} from './helpers';
import {body} from './fixtures/data';
// requirement: REQ-3.2

test('REQ-3.2: Read a published question',async({page,browser},info)=>{
  const data=await prepareReadingQuestion(browser,info);
  await login(page,'stack_user');await openQuestion(page,data.title);
  await expectBody(post(page),body);
  for(const name of ['node.js','http','retry'])await expectDisplayedTag(post(page),name);
  for(const name of ['Up vote','Down vote','Save','Timeline','Share','Follow'])await expect(action(post(page),name)).toBeVisible();
  await noUsableAction(post(page),'Edit question');await noUsableAction(post(page),'Delete question');
  await expectNumeric(post(page),'Score',7);
  await expect(output(page,'Asked')).toContainText(utcDatePattern(data.asked.start,data.asked.end));
  await expect(output(page,'Modified')).toContainText(utcDatePattern(data.modified.start,data.modified.end));
  const views=await numeric(page,'View count');expect(views).toBeGreaterThanOrEqual(42);
  const answers=await numeric(page,'Answer count');
  const author=region(post(page),'Author');await expect(author).toContainText(data.author.displayName);
  await expect(author.getByRole('img')).toBeVisible();await expectNumeric(author,'Reputation',data.authorReputation);await expect(author).toContainText(utcDatePattern(data.asked.start,data.asked.end));
  await expectAuthorBadges(author);await expect(author).toContainText('Teacher');
  await expect(action(region(post(page),'Comments'),'Add a comment')).toBeVisible();
  await action(mainNav(page),'Questions').click();
  const summary=region(region(page,'Question feed'),`Question ${data.title}`);
  await expectNumeric(summary,'Score',7);await expectNumeric(summary,'Answer count',answers);
  for(const name of ['node.js','http','retry'])await expectDisplayedTag(summary,name);
  await openQuestion(page,data.title);await page.reload();
  expect(await numeric(page,'View count')).toBeGreaterThanOrEqual(views);
});
