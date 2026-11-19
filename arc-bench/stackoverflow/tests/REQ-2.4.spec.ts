import {test, expect, login, ownProfile, action, field, region, expectField, readField, actorName, actor, suffix, entry, saveProfile, profileView, profileText, saveConfirmation, freshSession } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-2.4

test('REQ-2.4: Save and reopen public identity', async ({ page, browser }, info) => {
  const sessions:Array<{close:()=>Promise<void>}>=[];
  const reopen=async(name:string)=>{
    const session=await freshSession(page,{...actor('profile_editor'),displayName:name});sessions.push(session);page=session.page;
    await ownProfile(page,name);
  };
  let sessionFailure:unknown;
  try {
  await login(page,'profile_editor');
  await ownProfile(page);
  await action(page,'Edit profile').click();
  await expect(page.getByRole('heading',{name:'Edit your profile',exact:true})).toBeVisible();
  const initial: Record<string,string> = {'Display name':actorName('profile_editor'),'Full name':'Existing User','Location':'Beijing','Title':'Developer','About me':'Existing biography','Website link':'https://example.org','X':'https://x.com/example','GitHub':'https://github.com/existing'};
  for (const [name,value] of Object.entries(initial)) await field(page,name).fill(value);
  await saveProfile(page,initial['Display name']);
  await reopen(initial['Display name']);
  await action(page,'Edit profile').click();
  for (const [name,value] of Object.entries(initial)) await expectField(field(page,name),value);
  let failure: unknown;
  try {
  const updates: Record<string,string> = {'Display name':`Updated developer ${suffix(info)}`,'Full name':'Stack Overflow User','Location':'Shanghai','Title':'Backend Engineer','About me':'I enjoy building APIs and developer tooling for teams.','Website link':'www.example.dev','GitHub':'github.com/example'};
  for (const [name,value] of Object.entries(updates)) await field(page,name).fill(value);
  const preview=region(page,'Preview');
  if(await preview.count()){await expect(preview).toHaveCount(1);for(const key of ['Display name','Location','Title','About me'])await expect(preview).toContainText(updates[key]);}
  await saveProfile(page,updates['Display name']);
  await expect(saveConfirmation(page)).toBeVisible();
  await reopen(updates['Display name']);
  for (const value of [updates['Display name'],'Shanghai','Backend Engineer',updates['About me']]) await expect(profileText(profileView(page,updates['Display name']),value)).toBeVisible();
  await action(page,'Edit profile').click();
  for (const [name,value] of Object.entries(updates)) {
    if (name === 'Website link' || name === 'GitHub') {
      const normalized=(await readField(field(page,name))).replace(/^https?:\/\//,'').replace(/\/$/,'');
      expect(normalized).toBe(value);
    }
    else await expectField(field(page,name),value);
  }
  await expectField(field(page,'X'),initial.X);
  } catch (error) { failure=error; throw error; } finally {
    try {
    // This test ends in the editor on success. On failure reopen through the UI.
    if (!await field(page,'Display name').isVisible()) await action(page,'Edit profile').click();
    for (const [name,value] of Object.entries(initial)) await field(page,name).fill(value);
    await saveProfile(page,initial['Display name']);
    } catch (cleanup) { if (failure) throw new AggregateError([failure,cleanup], 'Profile check and restoration failed'); throw cleanup; }
  }
  } catch(error){sessionFailure=error;throw error;}
  finally {
    const cleanupErrors:unknown[]=[];
    for(const session of sessions.reverse())try{await session.close();}catch(error){cleanupErrors.push(error);}
    if(cleanupErrors.length)throw new AggregateError(sessionFailure?[sessionFailure,...cleanupErrors]:cleanupErrors,'Profile verification session cleanup failed');
  }
});
