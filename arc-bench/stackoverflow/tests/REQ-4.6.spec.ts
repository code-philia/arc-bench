import { test, expect, login, openQuestion, ownProfile, action, region, answer, output, asUser, createQuestion, createAnswer, numeric, expectNumeric, confirmDeletion } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.6

test('REQ-4.6: Delete answer and reverse vote reputation', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Delete Question');
  const text='This answer is reserved for the answer deletion scenario.';
  await createAnswer(browser,title,'answer_delete_user',text);
  let reputation=0;
  await asUser(browser,'answer_voter',async voter => {
    await openQuestion(voter,title);
    reputation=await numeric(region(answer(voter,'Stack User'),'Author'),'Reputation');
    await action(answer(voter,'Stack User'),'Up vote').click();
    await expectNumeric(region(answer(voter,'Stack User'),'Author'),'Reputation',reputation+10);
  });
  await login(page,'answer_delete_user'); await openQuestion(page,title);
  await action(answer(page,'Stack User'),'Delete').click(); await confirmDeletion(page);
  await expect(region(page,'Answers').getByText(text,{exact:true})).toHaveCount(0);
  await expect(output(page,'Answer count')).toHaveText('0');
  await ownProfile(page); await expectNumeric(page,'Reputation',reputation);
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,title);
   await expect(region(visitor,'Answers').getByText(text,{exact:true})).toHaveCount(0);
   await expect(output(visitor,'Answer count')).toHaveText('0');
  });
});
