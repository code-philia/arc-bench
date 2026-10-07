import { test, expect, login, action, field, region, mainNav, output, titleFor } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-6.5

test('REQ-6.5: Save and reapply python unanswered criteria', async ({ page, browser }, info) => {
  await login(page,'filter_user'); await action(mainNav(page),'Questions').click();
  await action(page,'Filter').click();
  const panel=region(page,'Filter panel');
  await panel.getByRole('checkbox',{name:'Unanswered',exact:true}).check();
  await panel.getByRole('combobox',{name:'Sort',exact:true}).selectOption({label:'Newest'});
  await field(panel,'Tags').fill('python');
  await expect(panel.getByRole('checkbox',{name:'Unanswered',exact:true})).toBeChecked();
  await expect(panel.getByRole('combobox',{name:'Sort',exact:true}).getByRole('option',{selected:true})).toHaveText('Newest');
  await expect(field(panel,'Tags')).toHaveValue('python');
  await action(panel,'Save custom filter').click();
  const dialog=page.getByRole('dialog',{name:'Save custom filter',exact:true});
  await expect(dialog).toBeVisible();
  const name=titleFor(info,'Python unanswered filter');
  await field(dialog,'Filter title').fill(name); await action(dialog,'Save filter').click();
  const assertResults=async () => {
   const feed=region(page,'Question feed');
   await expect(action(feed,'SO Python Unanswered Recent')).toBeVisible();
   for (const title of ['SO Python Answered Active',retryTitle,'How does React state update?']) await expect(action(feed,title)).toHaveCount(0);
   const summaries=feed.getByRole('region',{name:/^Question /});
   for (const summary of await summaries.all()) {
    await expect(action(summary,'python')).toBeVisible();
    await expect(output(summary,'Answer count')).toHaveText('0');
   }
  };
  await assertResults();
  await action(mainNav(page),'Home').click(); await page.reload();
  await action(region(page,'Saved filters'),name).click();
  await assertResults();
  await action(page,'Filter').click();
  await expect(panel.getByRole('checkbox',{name:'Unanswered',exact:true})).toBeChecked();
  await expect(field(panel,'Tags')).toHaveValue('python');
  await expect(panel.getByRole('combobox',{name:'Sort',exact:true}).getByRole('option',{selected:true})).toHaveText('Newest');
});
