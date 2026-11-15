import {test, expect, login, openQuestion, action, region, post, numeric, expectNumeric, createQuestion, expectActive } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-3.6

test('REQ-3.6: Apply and remove question upvote', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'helpful_user','SO Upvote Question');
  await login(page,'question_upvoter');
  await openQuestion(page,title);
  const author=region(post(page),'Author'), reputation=await numeric(author,'Reputation');
  const score = await numeric(post(page),'Score');
  await expectNumeric(post(page),'Score',0);
  await action(post(page),'Up vote').click();
  await expectNumeric(post(page),'Score',score+1);
  await expectActive(action(post(page),'Up vote'),true);
  await expectNumeric(author,'Reputation',reputation+10);
  await page.reload();
  await expectNumeric(post(page),'Score',score+1);
  await expectActive(action(post(page),'Up vote'),true);
  await expectNumeric(region(post(page),'Author'),'Reputation',reputation+10);
  await action(post(page),'Up vote').click();
  await expectNumeric(post(page),'Score',score);
  await expectActive(action(post(page),'Up vote'),false);
  await expectNumeric(region(post(page),'Author'),'Reputation',reputation);
});
