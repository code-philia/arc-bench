import { test, expect, login, openQuestion, action, region, post, numeric, expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-3.6

test('REQ-3.6: Apply question downvote', async ({ page, browser }, info) => {
  await login(page,'question_downvoter');
  await openQuestion(page,'SO Downvote Question');
  const author=region(post(page),'Author'), reputation=await numeric(author,'Reputation');
  await expectNumeric(post(page),'Score',3);
  await action(post(page),'Down vote').click();
  await expectNumeric(post(page),'Score',2);
  await expect(action(post(page),'Down vote')).toHaveAttribute('aria-pressed','true');
  await expectNumeric(author,'Reputation',reputation-2);
});
