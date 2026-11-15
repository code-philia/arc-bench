import {test, expect, entry, action, region, mainNav, expectCurrent, prepareActor, actorName, actor, publicUserAction, createQuestion, expectPaginationEnd } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-1.2

test('REQ-1.2: Open major community sections', async ({ page, browser }, info) => {
  await prepareActor(page,'helpful_user'); await prepareActor(page,'stack_user');
  await createQuestion(browser,info,'question_creator','A public retry question for navigation');
  await entry(page);
  for (const [name, content] of [['Questions','Question feed'],['Tags','Tags'],['Users','Users'],['Home','Question feed']]) {
    await action(mainNav(page), name).click();
    await expectCurrent(action(mainNav(page), name));
    await expect(region(page, content)).toBeVisible();
  }
  await expect(action(region(page,'Question feed'),'Next page')).toBeVisible();
  await action(mainNav(page), 'Users').click();
  await expect(await publicUserAction(page,actor('helpful_user'))).toBeVisible();
  await action(mainNav(page),'Users').click();
  await expect(await publicUserAction(page,actor('stack_user'))).toBeVisible();
  await action(mainNav(page),'Home').click();await expectPaginationEnd(region(page,'Question feed'));
});
