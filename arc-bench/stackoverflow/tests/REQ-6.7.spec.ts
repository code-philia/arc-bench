import { test, expect, login, action, field, region, mainNav, titleFor, asUser } from './helpers';
import { accounts } from './fixtures/data';

// requirement: REQ-6.7

test('REQ-6.7: Isolate custom filters between accounts', async ({ page, browser }, info) => {
  await login(page,'filter_user'); await action(mainNav(page),'Questions').click(); await action(page,'Filter').click();
  const panel=region(page,'Filter panel'); await panel.getByRole('checkbox',{name:'Unanswered',exact:true}).check();
  await panel.getByRole('combobox',{name:'Sort',exact:true}).selectOption({label:'Newest'}); await field(panel,'Tags').fill('python');
  await action(panel,'Save custom filter').click(); const dialog=page.getByRole('dialog',{name:'Save custom filter',exact:true});
  const name=titleFor(info,'Python unanswered filter'); await field(dialog,'Filter title').fill(name); await action(dialog,'Save filter').click();
  await expect(action(region(page,'Saved filters'),name)).toBeVisible();
  await asUser(browser,'stack_user',async other => {
   await action(mainNav(other),'Questions').click(); await expect(action(region(other,'Saved filters'),name)).toHaveCount(0);
  });
  await page.reload(); await expect(action(region(page,'Saved filters'),name)).toBeVisible();
  await action(region(page,'Saved filters'),name).click();
});
