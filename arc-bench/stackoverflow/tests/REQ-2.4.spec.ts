import { test, expect, login, ownProfile, action, field, region } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-2.4

test('REQ-2.4: Save and reopen public identity', async ({ page, browser }, info) => {
  await login(page,'profile_editor');
  await ownProfile(page);
  await action(page,'Edit profile').click();
  await expect(page.getByRole('heading',{name:'Edit your profile',exact:true})).toBeVisible();
  const initial: Record<string,string> = {'Display name':'Stack User','Full name':'Existing User','Location':'Beijing','Title':'Developer','About me':'Existing biography','Website':'https://example.org','X':'https://x.com/example','GitHub':'https://github.com/existing'};
  for (const [name,value] of Object.entries(initial)) await expect(field(page,name)).toHaveValue(value);
  const updates: Record<string,string> = {'Display name':'Stack User Updated','Full name':'Stack Overflow User','Location':'Shanghai','Title':'Backend Engineer','About me':'I enjoy building APIs and developer tooling for teams.','Website':'www.example.dev','GitHub':'github.com/example'};
  for (const [name,value] of Object.entries(updates)) await field(page,name).fill(value);
  await action(page,'Save and copy changes to all public communities').click();
  await expect(page.getByRole('status').filter({hasText:/success|saved|updated/i})).toBeVisible();
  for (const value of ['Stack User Updated','Shanghai','Backend Engineer',updates['About me']]) await expect(region(page,'Public profile').getByText(value,{exact:true})).toBeVisible();
  await action(page,'Edit profile').click();
  for (const [name,value] of Object.entries(updates)) {
    if (name === 'Website' || name === 'GitHub') {
      const normalized=(await field(page,name).inputValue()).replace(/^https?:\/\//,'').replace(/\/$/,'');
      expect(normalized).toBe(value);
    }
    else await expect(field(page,name)).toHaveValue(value);
  }
  await expect(field(page,'X')).toHaveValue(initial.X);
});
