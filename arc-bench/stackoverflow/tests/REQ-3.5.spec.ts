import { test, expect, login, openQuestion, action, region, post, numeric, expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-3.5

test('REQ-3.5: Apply and remove question upvote', async ({ page, browser }, info) => {
  await login(page,'question_upvoter');
  await openQuestion(page,'SO Upvote Question');
  const author=region(post(page),'Author'), reputation=await numeric(author,'Reputation');
  await expectNumeric(post(page),'Score',7);
  await action(post(page),'Up vote').click();
  await expectNumeric(post(page),'Score',8);
  await expect(action(post(page),'Up vote')).toHaveAttribute('aria-pressed','true');
  await expectNumeric(author,'Reputation',reputation+10);
  await page.reload();
  await expectNumeric(post(page),'Score',8);
  await expect(action(post(page),'Up vote')).toHaveAttribute('aria-pressed','true');
  await expectNumeric(region(post(page),'Author'),'Reputation',reputation+10);
  await action(post(page),'Up vote').click();
  await expectNumeric(post(page),'Score',7);
  await expect(action(post(page),'Up vote')).toHaveAttribute('aria-pressed','false');
  await expectNumeric(region(post(page),'Author'),'Reputation',reputation);
});
