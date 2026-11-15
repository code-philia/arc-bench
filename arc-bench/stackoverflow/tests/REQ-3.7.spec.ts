import {test, expect, login, openQuestion, action, region, post, numeric, expectNumeric, createQuestion, expectActive } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-3.7

test('REQ-3.7: Apply question downvote', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'helpful_user','SO Downvote Question');
  await login(page,'question_downvoter');
  await openQuestion(page,title);
  const author=region(post(page),'Author'), reputation=await numeric(author,'Reputation');
  const score = await numeric(post(page),'Score');
  await expectNumeric(post(page),'Score',0);
  await action(post(page),'Down vote').click();
  await expectNumeric(post(page),'Score',score-1);
  await expectActive(action(post(page),'Down vote'),true);
  await expectNumeric(author,'Reputation',reputation-2);
  await page.reload();await expectNumeric(post(page),'Score',score-1);await expectActive(action(post(page),'Down vote'),true);await expectNumeric(region(post(page),'Author'),'Reputation',reputation-2);
});
