import {test, expect, login, openQuestion, action, field, post, comment, noUsableAction, createQuestion, createComment, expectField, expectBody, freezeClock, setBusinessTime } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.4

test('REQ-5.4: Save comment within five minutes', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Edit Question');
  const period=await createComment(browser,title,'comment_edit_user'),before=period.start,published=period.end;
  expect(published-before).toBeLessThan(60000);
  await freezeClock(page,new Date(published+120000).toISOString());
  await login(page,'comment_edit_user'); await openQuestion(page,title);
  const original=comment(post(page));
  await action(original,'Edit comment').click();
  await expectField(field(original,'Comment'),commentBody);
  await field(original,'Comment').fill('Can you share a minimal retry example?');
  await field(original,'Comment').press('Enter');
  await expect(comment(post(page),'Can you share a minimal retry example?')).toContainText(/edited/i);
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  await expect(comment(post(page))).toHaveCount(0);
  await page.reload();
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  await expect(comment(post(page),'Can you share a minimal retry example?')).toContainText(/edited/i);
  await expect(comment(post(page))).toHaveCount(0);
  await setBusinessTime(page,new Date(published+240000).toISOString());
  await expect(action(comment(post(page),'Can you share a minimal retry example?'),'Edit comment')).toBeEnabled();
  for(const instant of [new Date(published+360000).toISOString()]){
    await setBusinessTime(page,instant);await page.reload();
    await noUsableAction(comment(post(page),'Can you share a minimal retry example?'),'Edit comment');
    await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  }
  await page.reload();
  await noUsableAction(comment(post(page),'Can you share a minimal retry example?'),'Edit comment');
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
});
