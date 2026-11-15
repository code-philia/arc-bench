import { createHash, randomBytes } from 'node:crypto';
import { expect, test as base, type Page, type Locator, type Browser, type TestInfo } from '@playwright/test';
import { accountRoles, historicalAccounts, password, body, answerBody, commentBody, identityFor, retryTitle, questionVoteGain } from './fixtures/data';
export { expect };
import { region, action, field, content, metric, navigation, owned, loginForm, signupForm, readInteger, profileView, profileText, saveConfirmation, searchField, acceptedAnswer, commentOwner, directReadableTextCount, bodyContent, publicIdentityAction } from './ui';
export { region, action, field, collection, loginForm, loginForms, signupForm, signupForms, displayTag, expectBrand, profileView, profileText, content, saveConfirmation, tagDescription, tagQuestionCount, searchField, acceptedAnswer, minimumPasswordMessage, profileReputation, catalogPagination, reputationContribution, upvoteDescription } from './ui';
type Identity = {email: string; password: string; displayName: string};
type ActorState = {nonce: string; identities: Map<Account,Identity>; prepared: Map<Account,Promise<Identity>>};
const states = new WeakMap<TestInfo,ActorState>();
const signedIn = new WeakMap<Page,Identity>();
function state() {
  const info=base.info();
  let value=states.get(info);
  if (!value) { value={nonce:randomBytes(10).toString('hex'),identities:new Map(),prepared:new Map()};states.set(info,value); }
  return value;
}
export function actor(role: Account): Identity {
  const value=state();
  if (!value.identities.has(role)) value.identities.set(role,
    role in historicalAccounts ? historicalAccounts[role as keyof typeof historicalAccounts] : identityFor(role,value.nonce));
  return value.identities.get(role)!;
}
export const actorName = (role: Account) => actor(role).displayName;
function signedInName(page: Page) {
  const identity=signedIn.get(page);
  if(!identity)throw new Error('The current profile identity must come from UI registration or verified login');
  return identity.displayName;
}
// Only freeze the business clock. Keep native timers, performance and animation
// frames running so browser actionability checks and context teardown can finish.
export async function freezeClock(page: Page, instant: string) {
  const milliseconds=Date.parse(instant);
  if(!Number.isFinite(milliseconds))throw new Error('Invalid business time');
  await page.clock.setFixedTime(milliseconds);
}

export const test = base.extend<{_actorScope:void}>({
  _actorScope:[async({},use,info)=>{try{await use();}finally{states.delete(info);}}, {auto:true}],
});
export type Account = typeof accountRoles[number];
export const mainNav = (page: Page) => navigation(page,'Main navigation',['Home','Questions','Tags','Users']);
export const profileNav = (page: Page) => navigation(page,'Profile navigation',['Activity','Reputation']);
export const activityNav = (page: Page) => navigation(page,'Activity navigation',['Summary','Answers','Questions','Responses']);
export const post = (page: Page) => owned(region(page, 'Question post').or(
  page.locator(':is(article,section):has(> h1):has(> p)').filter({hasNot:field(page,'Title')})
).or(
  page.locator('article:not([aria-label="Question post"] *,article article)')
    .filter({has:page.getByRole('heading',{level:1})})
    .filter({has:page.locator('p:not([aria-label="Comments"] *,[aria-label="Author"] *,[aria-label="Answers"] *,article article *)')})
    .filter({hasNot:field(page,'Title')})
));
export const answer = (page: Page, author = actorName('helpful_user')) => {
  const answers=region(page,'Answers');
  const identity=JSON.stringify(author);
  return owned(region(answers,`Answer by ${author}`).or(answers.locator(`article:has(> header:text-is(${identity})):has(> p),article:has(> header :text-is(${identity})):has(> p)`)));
};
export const comment = (scope: Page | Locator, text = commentBody) => {
  const thread=region(scope,'Comments');
  return commentOwner(commentFrom(thread,text));
};
export const output = metric;
export async function expectAuthorBadges(author: Locator) {
  const list=author.getByRole('list',{name:'Badges',exact:true}).filter({visible:true});
  if(await list.count()){
    await expect(list).toHaveCount(1);const badges=list.getByRole('listitem');
    expect(await badges.count()).toBeGreaterThan(0);
    for(const badge of await badges.all()){await expect(badge).toBeVisible();expect((await badge.innerText()).trim().length).toBeGreaterThan(0);}
  }else await expect(author).toContainText(/badge/i);
}
export async function readField(control: Locator) {
  return control.evaluate(element=>{
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return element.value;
    if (element instanceof HTMLElement && element.isContentEditable) return element.textContent === '' ? '' : element.innerText;
    throw new Error('Field has no readable editable value');
  });
}
export async function expectField(control: Locator, value: string) {
  await expect(control).toHaveCount(1);
  await expect.poll(()=>readField(control)).toBe(value);
}
export async function entry(page: Page) { await page.goto('/'); }
export async function expectAnonymous(page: Page) {
  await entry(page);
  await expect(action(page.getByRole('banner'),'Log in')).toBeVisible();
  await expect(action(page.getByRole('banner'),'Sign up')).toBeVisible();
}
export async function openLogin(page: Page) {
  await entry(page);
  await action(page.getByRole('banner'), 'Log in').click();
  return loginForm(page);
}
export async function saveProfile(page: Page, name: string) {
  await action(page,'Save and copy changes to all public communities').click();
  const confirmation=saveConfirmation(page);
  const profileName=profileText(profileView(page,name),name);
  // A completed save can stay in the editor with confirmation, or navigate
  // to the actual profile. Do not race an asynchronous save with page.goto.
  await expect(confirmation.or(profileName).filter({visible:true})).not.toHaveCount(0);
}
export async function registerIdentity(page: Page, identity: Identity) {
  await entry(page);
  await action(page.getByRole('banner'),'Sign up').click();
  const form=await signupForm(page);
  await field(form,'Email').fill(identity.email);
  await field(form,'Password').fill(identity.password);
  await action(form,'Create account').click();
  await expect(action(page.getByRole('banner'),identity.email)).toBeVisible();
  signedIn.set(page,{...identity,displayName:identity.email});
  if (identity.displayName !== identity.email) {
    await action(page.getByRole('banner'),identity.email).click();
    await action(page,'Edit profile').click();
    await field(page,'Display name').fill(identity.displayName);
    await saveProfile(page,identity.displayName);
    const verification=await freshSession(page,identity);
    let failure:unknown;
    try {
      await action(verification.page.getByRole('banner'),identity.displayName).click();
      await expect(profileText(profileView(verification.page,identity.displayName),identity.displayName)).toBeVisible();
      await verification.page.reload();
      await expect(profileText(profileView(verification.page,identity.displayName),identity.displayName)).toBeVisible();
    } catch(error){failure=error;throw error;}
    finally {try{await verification.close();}catch(error){if(failure)throw new AggregateError([failure,error],'Identity verification and context cleanup failed');throw error;}}
  }
  signedIn.set(page,identity);
}
export async function prepareActor(page: Page, role: Account) {
  const value=state(),identity=actor(role);
  if (role in historicalAccounts) return identity;
  if (!value.prepared.has(role)) {
    // Registration and profile setup add real UI operations. Budget them once
    // per identity; action/assertion timeouts and retries remain unchanged.
    base.info().setTimeout(base.info().timeout+30_000);
    value.prepared.set(role,(async()=>{
      const browser=page.context().browser();
      if (!browser) throw new Error('Identity preparation needs an isolated browser context');
      const context=await browser.newContext({baseURL:base.info().project.use.baseURL,timezoneId:'UTC'});
      let failure:unknown;
      try {await registerIdentity(await context.newPage(),identity);return identity;}
      catch(error){failure=error;throw error;}
      finally {try{await context.close();}catch(error){if(failure)throw new AggregateError([failure,error],'Identity preparation and context cleanup failed');throw error;}}
    })());
  }
  return value.prepared.get(role)!;
}
export async function login(page: Page, account: Account) {
  const identity=await prepareActor(page,account);
  await loginIdentity(page,identity);
}
export async function loginIdentity(page: Page, identity: Identity) {
  const form = await openLogin(page);
  await field(form, 'Email').fill(identity.email);
  await field(form, 'Password').fill(identity.password);
  await action(form, 'Sign in').click();
  await expect(region(page, 'Question feed')).toBeVisible();
  await expect(action(page.getByRole('banner'),identity.displayName)).toBeVisible();
  signedIn.set(page,identity);
}
export async function freshSession(reference: Page, identity: Identity) {
  const browser=reference.context().browser();
  if(!browser)throw new Error('Fresh UI verification needs an isolated browser context');
  const context=await browser.newContext({baseURL:new URL(reference.url()).origin,timezoneId:'UTC'});
  try {
    const page=await context.newPage();await loginIdentity(page,identity);
    return {page,close:()=>context.close()};
  } catch(error){try{await context.close();}catch(cleanup){throw new AggregateError([error,cleanup],'Fresh UI login and context cleanup failed');}throw error;}
}
export async function openQuestion(page: Page, title: string) {
  await action(mainNav(page), 'Questions').click();
  // Public Search is used rather than assuming the question is on page one.
  await searchField(page).fill(title);
  await searchField(page).press('Enter');
  await action(region(page, 'Search results'), title).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(post(page)).toBeVisible();
}
export async function publicUserAction(page: Page, identity: Identity, distinguishEmail=false) {
  const directory=region(page,'Users');
  await expect(directory).toBeVisible();
  const target=distinguishEmail?publicIdentityAction(directory,identity.displayName,identity.email):action(directory,identity.displayName);
  const search=field(directory,'Filter by user').or(field(directory,'Search users'));
  if(await search.count()) {await expect(search).toHaveCount(1);await search.fill(identity.displayName);await expect(target).toHaveCount(1);await expect(target).toBeVisible();return target;}
  const next=action(directory,'Next page');
  const seen=new Set<string>();
  for(;;){
    await expect.poll(async()=>await target.count()>0 || await next.count()===1 && await next.isEnabled()).toBe(true);
    if(await target.count()){await expect(target,'The public identity must be unique').toHaveCount(1);await expect(target).toBeVisible();return target;}
    const signature=await directory.innerText();
    if(seen.has(signature))throw new Error('Users pagination repeated without reaching the registered identity');
    seen.add(signature);
    await expect(next,'Registered members must be reachable in the public catalog').toHaveCount(1);
    await expect(next).toBeEnabled();await next.click();
    await expect.poll(()=>directory.innerText()).not.toBe(signature);
  }
}
export async function ownProfile(page: Page, name = signedInName(page)) {
  await action(page.getByRole('banner'), name).click();
  await expect(profileNav(page)).toBeVisible();
}
export async function activity(page: Page, category: string, name = signedInName(page)) {
  await ownProfile(page,name);
  await action(profileNav(page), 'Activity').click();
  await action(activityNav(page), category).click();
  return region(page, 'Activity content');
}
export function suffix(info: TestInfo) {
  const slug = createHash('sha256').update(info.title).digest('hex').slice(0, 10);
  return `${state().nonce}-${info.parallelIndex}-${slug}`;
}
export function titleFor(info: TestInfo, stem: string) { return `${stem} ${suffix(info)}`; }
export async function composeQuestion(page: Page, title: string, text = body, tags = 'node.js,http,retry') {
  await action(region(page, 'Question feed'), 'Ask Question').click();
  await field(page, 'Title').fill(title);
  await field(page, 'Body').fill(text);
  await field(page, 'Tags').fill(tags);
  await action(page, 'Post Your Question').click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await assertQuestion(page, title, text, tags);
}
export async function assertQuestion(page: Page, title: string, text: string, tags: string) {
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expectBody(post(page),text);
  for (const tag of tags.split(',').map(value => value.trim()).filter(Boolean)) await expect(action(post(page),tag)).toBeVisible();
}
export async function expectBody(scope: Locator, text: string, includeRecordRoot=false) {
  await expect(scope).toBeVisible();
  const exact=bodyContent(scope,text);
  if(await exact.count())await expect(exact).toBeVisible();
  else await expect.poll(()=>directReadableTextCount(scope,text,includeRecordRoot)).toBe(1);
}
export async function expectCommentTimestamp(scope: Locator, period?:{start:number;end:number}) {
  const date = /^(?:just now|(?:a|an|\d+)\s+(?:secs?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?|years?)\s+ago|\d{4}-\d{2}-\d{2}(?:[T ][0-9:.]+(?:Z|[+-]\d{2}:\d{2})?)?(?: UTC)?|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?(?:\s+(?:at\s+)?\d{1,2}:\d{2})?)$/i;
  const time = scope.locator('time').filter({visible:true});
  const candidates = time.or(scope.getByText(date,{exact:true}).and(scope.locator('*:not(time,time *)')).filter({visible:true}));
  await expect(candidates).toHaveCount(1);
  const displayed=(await candidates.innerText()).trim();
  expect(displayed).toMatch(date);
  if (/^\d{4}-\d{2}-\d{2}/.test(displayed)) {
    const day=displayed.slice(0,10),parsed=Date.parse(day);
    expect(Number.isFinite(parsed)).toBe(true);
    expect(new Date(parsed).toISOString().slice(0,10)).toBe(day);
  }
  const datetime=await candidates.getAttribute('datetime');
  if(datetime !== null) expect(Number.isFinite(Date.parse(datetime))).toBe(true);
  if(period){
    if(datetime&&/T/.test(datetime)){
      const instant=Date.parse(/[Zz]$|[+-]\d{2}:?\d{2}$/.test(datetime)?datetime:datetime+'Z');expect(instant).toBeGreaterThanOrEqual(period.start-1000);expect(instant).toBeLessThanOrEqual(period.end+1000);
    }else if(/\d{4}/.test(displayed)||datetime){
      expect(datetime||displayed).toMatch(utcDatePattern(period.start,period.end));
    }else if(/^[A-Za-z]+\s+\d/.test(displayed)){
      const dates=[...new Set([period.start,period.end].map(value=>new Date(value).getUTCFullYear()))];
      expect(dates.some(year=>utcDatePattern(period.start,period.end).test(displayed.replace(/^([A-Za-z]+\s+\d{1,2})/,(_all,day)=>day+', '+year)))).toBe(true);
    }else{
      const minAge=Math.max(0,Date.now()-period.end),maxAge=Math.max(0,Date.now()-period.start);
      if(/^just now$/i.test(displayed))expect(minAge).toBeLessThan(60000);
      else{
        const m=displayed.match(/^(a|an|\d+)\s+(secs?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?|years?)\s+ago$/i);
        if(!m)throw new Error('Unrecognized relative comment timestamp');
        const scale=/^s/i.test(m[2])?1000:/^m(?:in)?s?$|^minutes?$/i.test(m[2])?60000:/^h/i.test(m[2])?3600000:/^d/i.test(m[2])?86400000:/^w/i.test(m[2])?604800000:0;
        if(!scale)throw new Error('A freshly published comment cannot be months or years old');
        const age=(m[1].toLowerCase()==='a'||m[1].toLowerCase()==='an'?1:Number(m[1]))*scale;
        expect(age).toBeGreaterThanOrEqual(minAge-scale);expect(age).toBeLessThanOrEqual(maxAge+scale);
      }
    }
  }

}
export async function expectComments(thread: Locator, texts: string[]) {
  await expect(thread).toBeVisible();
  const selector = '[role="region"][aria-label^="Comment "],:is(article,section,li,div)[aria-label^="Comment "],li:has(> :is(p,span)),article:has(> :is(p,span))';
  const records = topLevelComments(thread,thread.locator(selector)).filter({visible:true});
  await expect(records).toHaveCount(texts.length);
  for (const text of texts) await expectBody(owned(commentFrom(thread,text)),text);
  const remainder = await thread.evaluate((element, selector) => {
    const clone = element.cloneNode(true) as Element;
    clone.querySelectorAll(selector + ',button,a,input,textarea,select,[role="button"],[role="link"]').forEach(item=>item.remove());
    return (clone.textContent||'').trim().replace(/\s+/g,' ');
  },selector);
  if (remainder && !/^(?:Comments|\d+ comments?)$/i.test(remainder)) throw new Error(`Unrecognized comment content: ${remainder}`);
}
const topLevelComments = (thread: Locator, candidate: Locator) => candidate.and(thread.locator('*:not(:scope [aria-label="Replies"] *,:scope [aria-label^="Comment "] *,:scope article *,:scope li *,:scope section *)'));
const commentFrom = (thread: Locator, text: string) => topLevelComments(thread,region(thread,`Comment ${text}`).or(thread.locator(`:is(li,article):has(> :is(p,span):text-is(${JSON.stringify(text)}))`)));
export async function publishAnswer(page: Page, text = answerBody) {
  const before = await numeric(page, 'Answer count');
  await field(page, 'Your Answer').fill(text);
  await action(page, 'Post Your Answer').click();
  await expect(region(page, 'Answers').getByText(text, { exact: true })).toBeVisible();
  await expectNumeric(page, 'Answer count', before + 1);
}
export async function publishComment(scope: Locator, text = commentBody) {
  await action(scope, 'Add a comment').click();
  await field(scope, 'Comment').fill(text);
  const start=Date.now();await field(scope, 'Comment').press('Enter');
  const expand = scope.getByRole('button',{name:/^Show \d+ more comments$/i}).or(scope.getByRole('link',{name:/^Show \d+ more comments$/i})).filter({visible:true});
  await expect(comment(scope,text).or(expand).filter({visible:true})).not.toHaveCount(0);
  if (!await comment(scope,text).isVisible()) await expand.click();
  await expect(comment(scope, text)).toBeVisible();
  await expectBody(comment(scope,text),text);
  return {start,end:Date.now()};
}
export async function asUser(browser: Browser, account: Account, use: (page: Page) => Promise<void>) {
  const context = await browser.newContext({ baseURL: base.info().project.use.baseURL, timezoneId: 'UTC' });
  let failure:unknown;
  try {
    const page = await context.newPage();
    await login(page, account);
    await use(page);
  } catch(error) {failure=error;throw error;}
  finally {try{await context.close();}catch(error){if(failure)throw new AggregateError([failure,error],'Business operation and context cleanup failed');throw error;}}
}
export async function createQuestion(browser: Browser, info: TestInfo, owner: Account, stem: string, tags='node.js,http,retry') {
  const title = titleFor(info, stem);
  await asUser(browser, owner, async page => {
    await composeQuestion(page, title,body,tags);
    await verifySavedQuestion(page,title,body,tags);
    const content=await activity(page,'Questions',actorName(owner));
    await expect(action(content,title)).toBeVisible();
  });
  return title;
}
export async function verifySavedQuestion(page: Page, title: string, text: string, tags: string) {
  // Wait for the saved public state before reloading; an asynchronous save must
  // not be aborted by navigation while the editor route is still active.
  await assertQuestion(page,title,text,tags);
  await page.reload();
  await assertQuestion(page,title,text,tags);
}
export async function createAnswer(browser: Browser, title: string, author: Account = 'helpful_user', text = answerBody) {
  await asUser(browser, author, async page => {
    await openQuestion(page, title); await publishAnswer(page, text);
    const count=await numeric(page,'Answer count');
    await page.reload();
    await expectBody(answer(page,actorName(author)),text);
    await expectNumeric(page,'Answer count',count);
    const content=await activity(page,'Answers',actorName(author));
    await expect(action(content,title)).toBeVisible();
  });
}
export async function expectQuestionAbsent(page: Page, title: string) {
  const search=searchField(page);
  await search.fill(title); await search.press('Enter');
  await expect(region(page,'Search results')).toBeVisible();
  await expect(action(region(page,'Search results'),title)).toHaveCount(0);
}
export async function createComment(browser: Browser, title: string, author: Account, text = commentBody) {
  let period!:{start:number;end:number};
  await asUser(browser, author, async page => { await openQuestion(page, title); period=await publishComment(post(page), text); });
  return period;
}
export async function createSortableQuestion(browser: Browser, info: TestInfo) {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Sorting Question');
  await createAnswer(browser,title,'helpful_user','Highest score answer: use bounded retries.');
  await asUser(browser,'answer_voter',async voter=>{
    await openQuestion(voter,title);
    await action(answer(voter),'Up vote').click();
    await expectNumeric(answer(voter),'Score',1);
  });
  await createAnswer(browser,title,'answer_submitter','Recent answer: log each retry attempt.');
  return title;
}
export async function prepareActivity(browser: Browser, info: TestInfo, options: {reputation?:boolean;responses?:boolean;privateVote?:boolean;accepted?:boolean}={}) {
  const reactTitle=await createQuestion(browser,info,'question_creator','A React state activity parent');
  const ownedTitle=await createQuestion(browser,info,'activity_user','An owned activity question');
  const excerpt='Batch state updates safely.';
  await createAnswer(browser,reactTitle,'activity_user',excerpt+' '+answerBody);
  await createAnswer(browser,ownedTitle,'helpful_user');
  if(options.accepted)await asUser(browser,'question_creator',async owner=>{
    await openQuestion(owner,reactTitle);
    await action(answer(owner,actorName('activity_user')),'Accept answer').click();
    await owner.reload();
    await expect(acceptedAnswer(answer(owner,actorName('activity_user')))).toBeVisible();
  });
  if(options.reputation)await asUser(browser,'answer_voter',async voter=>{
    await openQuestion(voter,ownedTitle);await expectNumeric(post(voter),'Score',0);
    const baseline=await numeric(region(post(voter),'Author'),'Reputation');
    await action(post(voter),'Up vote').click();await expectNumeric(post(voter),'Score',1);
    await expectNumeric(region(post(voter),'Author'),'Reputation',baseline+10);
    await openQuestion(voter,reactTitle);
    await expectNumeric(answer(voter,actorName('activity_user')),'Score',0);
    await action(answer(voter,actorName('activity_user')),'Up vote').click();
    await expectNumeric(answer(voter,actorName('activity_user')),'Score',1);
    await expectNumeric(region(answer(voter,actorName('activity_user')),'Author'),'Reputation',baseline+20);
  });
  const responseText='Check the state updater callback.';
  const answerResponseText='Please show how the update is batched.';
  const unrelatedResponseText='This comment belongs to the question author rather than the answer author.';
  if(options.responses){
    await createComment(browser,ownedTitle,'helpful_user',responseText);
    await asUser(browser,'question_comment_user',async commenter=>{
      await openQuestion(commenter,reactTitle);
      await publishComment(answer(commenter,actorName('activity_user')),answerResponseText);
    });
    await createComment(browser,reactTitle,'helpful_user',unrelatedResponseText);
  }
  if(options.privateVote)await asUser(browser,'activity_user',async voter=>{
    await openQuestion(voter,reactTitle);
    await expectNumeric(post(voter),'Score',0);
    await action(post(voter),'Up vote').click();await expectNumeric(post(voter),'Score',1);
  });
  return {reactTitle,ownedTitle,excerpt,responseText,answerResponseText,unrelatedResponseText,questionScore:options.reputation?1:0,answerCount:1};
}
export async function responseEntry(scope: Locator, text: string, parentTitle: string) {
  const row=owned(scope.locator('li,article,[role="listitem"]').filter({has:action(scope.page(),parentTitle)}).filter({hasText:text}).and(scope.locator(':scope *:not(:scope form *,:scope aside *,:scope nav *)')).filter({visible:true}));
  await expect(row,'One response record must own both its comment and parent link').toHaveCount(1);
  await expectBody(row,text,true);
  await expect(action(row,parentTitle)).toHaveCount(1);
  await expect(action(row,parentTitle)).toBeVisible();
  return row;
}
export async function expectResponse(scope:Locator,text:string,parentTitle:string) {
  const row=await responseEntry(scope,text,parentTitle);
  const page=scope.page();
  await action(row,parentTitle).click();
  await expect(page.getByRole('heading',{name:parentTitle,exact:true})).toBeVisible();
  await activity(page,'Responses');
}
export async function numeric(scope: Page | Locator, name: string) {
  return readInteger(scope,name);
}
export async function expectNumeric(scope: Page | Locator, name: string, value: number) {
  await expect.poll(()=>numeric(scope,name)).toBe(value);
}
export async function expectActive(control: Locator, active: boolean) {
  await expect(control).toHaveCount(1);
  await expect.poll(() => control.evaluate(element => {
    const pressed = element.getAttribute('aria-pressed');
    if (pressed === 'true' || pressed === 'false') return pressed === 'true';
    if (element instanceof HTMLInputElement && ['checkbox','radio'].includes(element.type)) return element.checked;
    const state = element.getAttribute('data-state');
    if (state === 'active' || state === 'inactive') return state === 'active';
    return null; // An unknown state is never silently treated as inactive.
  })).toBe(active);
}
export async function expectCurrent(control: Locator) {
  await expect(control).toHaveCount(1);
  await expect.poll(()=>control.evaluate(element=>
    ['page','true'].includes(element.getAttribute('aria-current')||'') ||
    element.getAttribute('aria-selected') === 'true' ||
    element.getAttribute('data-state') === 'active' ||
    element.matches('.current,.selected,.active')
  )).toBe(true);
}

export async function withUnwatchedPython(page: Page, use: () => Promise<void>) {
  const open = async () => {
    await action(mainNav(page),'Tags').click();
    await action(region(region(page,'Tags'),'Tag python'),'python').click();
  };
  await open();
  const watched = action(region(page,'Python tag'),'Unwatch tag');
  const unwatched = action(region(page,'Python tag'),'Watch tag');
  await expect(watched.or(unwatched)).toHaveCount(1);
  const original = await watched.count() === 1;
  if (original) await watched.click();
  let failure: unknown;
  try { await use(); } catch (error) { failure=error; throw error; }
  finally {
    try {
      await open();
      await expect(watched.or(unwatched)).toHaveCount(1);
      if ((await watched.count() === 1) !== original) await (original ? unwatched : watched).click();
      await expect(original ? watched : unwatched).toBeVisible();
    } catch (cleanup) { if (failure) throw new AggregateError([failure,cleanup], 'Watch check and restoration failed'); throw cleanup; }
  }
}
export async function checkPythonWatchIsolation(watcher: Page, other: Page) {
  // Establish both baselines before either Watch operation; normalizing the
  // second account afterwards could conceal a global preference leak.
  await withUnwatchedPython(watcher,()=>withUnwatchedPython(other,async()=>{
    await action(region(watcher,'Python tag'),'Watch tag').click();
    await expect(action(region(watcher,'Python tag'),'Unwatch tag')).toBeVisible();
    await action(mainNav(other),'Questions').click();
    await expect(action(region(other,'Watched tags'),'python')).toHaveCount(0);
    await action(mainNav(other),'Tags').click();
    await action(region(region(other,'Tags'),'Tag python'),'python').click();
    await expect(action(region(other,'Python tag'),'Watch tag')).toBeVisible();
    await expect(action(region(other,'Python tag'),'Unwatch tag')).toHaveCount(0);
    await watcher.reload();
    await expect(action(region(watcher,'Python tag'),'Unwatch tag')).toBeVisible();
    await action(region(watcher,'Python tag'),'Unwatch tag').click();
    await expect(action(region(watcher,'Python tag'),'Watch tag')).toBeVisible();
  }));
}
export async function beforeText(scope: Locator, firstIdentity: string, secondIdentity: string) {
  const first = scope.getByText(firstIdentity, {exact:true}).filter({visible:true});
  const second = scope.getByText(secondIdentity, {exact:true}).filter({visible:true});
  await expect(first).toHaveCount(1); await expect(second).toHaveCount(1);
  await expect.poll(async () => {
    const a = await first.boundingBox(), b = await second.boundingBox();
    if (!a || !b) return false;
    return a.y < b.y || (a.y === b.y && a.x < b.x);
  }).toBe(true);
}
export async function confirmDeletion(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Confirm deletion', exact: true });
  await expect(dialog).toBeVisible();
  await expect.poll(()=>dialog.evaluate(element=>{const clone=element.cloneNode(true) as Element;clone.querySelectorAll('button,a,input,select,textarea,h1,h2,h3,[role=button],[role=link]').forEach(node=>node.remove());return (clone.textContent||'').trim();})).toMatch(/delet|remov/i);
  await action(dialog, 'Confirm deletion').click();
}

export async function noUsableAction(scope: Page | Locator, name: string) {
  if ('locator' in scope && !('goto' in scope)) await expect(scope as Locator).toBeVisible();
  const controls = action(scope, name).filter({ visible: true });
  // A hidden action or a visibly disabled action is unavailable to the user.
  for (const control of await controls.all()) await expect(control).toBeDisabled();
}

export async function beforeRecords(first:Locator,second:Locator) {
 await expect(first).toHaveCount(1);await expect(second).toHaveCount(1);
 await expect.poll(async()=>{const a=await first.boundingBox(),b=await second.boundingBox();return !!a&&!!b&&(a.y<b.y||a.y===b.y&&a.x<b.x)}).toBe(true);
}
export async function openRevisionHistory(owner:Locator) {
 await expect(owner).toHaveCount(1);await action(owner,'Timeline').click();
 const history=region(owner,'Revision history');await expect(history).toHaveCount(1);await expect(history).toBeVisible();return history;
}

export async function expectBodyAbsent(scope:Locator,text:string) {
 await expect(scope).toHaveCount(1);await expect(scope).toBeVisible();
 await expect(bodyContent(scope,text)).toHaveCount(0);
 await expect.poll(()=>directReadableTextCount(scope,text)).toBe(0);
}

/** Every mutable question, revision, vote and visit is established by product use. */
export async function prepareReadingQuestion(browser: Browser, info: TestInfo) {
  const title=titleFor(info,retryTitle), author=actor('badge_user');
  const asked={start:0,end:0},modified={start:0,end:0};let authorReputation=0;
  await asUser(browser,'badge_user',async owner=>{
    asked.start=Date.now();await composeQuestion(owner,title);asked.end=Date.now();
    await verifySavedQuestion(owner,title,body,'node.js,http,retry');
  });
  await asUser(browser,'badge_user',async owner=>{
    await openQuestion(owner,title);await action(post(owner),'Edit question').click();
    await field(owner,'Edit Summary').fill('Clarified retry safety.');
    modified.start=Date.now();await action(owner,'Save edits').click();
    await expectBody(post(owner),body);modified.end=Date.now();
  });
  const voters:Account[]=['question_upvoter','answer_voter','question_downvoter','answer_submitter','question_comment_user','comment_vote_user','answer_comment_user'];
  for(const [i,role]of voters.entries())await asUser(browser,role,async voter=>{
    await openQuestion(voter,title);await expectNumeric(post(voter),'Score',i);
    const reputation=await numeric(region(post(voter),'Author'),'Reputation');
    await action(post(voter),'Up vote').click();await expectNumeric(post(voter),'Score',i+1);
    authorReputation=reputation+questionVoteGain;await expectNumeric(region(post(voter),'Author'),'Reputation',authorReputation);
  });
  // Visiting an observed public URL is public navigation, not an insertion API.
  let publicURL='';
  await asUser(browser,'badge_user',async owner=>{await openQuestion(owner,title);publicURL=owner.url();});
  for(let visit=0;visit<42;visit++){
    const context=await browser.newContext({baseURL:base.info().project.use.baseURL,timezoneId:'UTC'});
    let failure:unknown;
    try {const reader=await context.newPage();await reader.goto(publicURL);await expect(reader.getByRole('heading',{name:title,exact:true})).toBeVisible();}
    catch(error){failure=error;throw error;}
    finally {try{await context.close();}catch(error){if(failure)throw new AggregateError([failure,error],'Public reading and context cleanup failed');throw error;}}
  }
  return {title,author,authorReputation,score:7,minimumViews:42,asked,modified};
}

/** Move only business Date; native browser timers and actionability keep running. */
export async function setBusinessTime(page:Page,instant:string){await freezeClock(page,instant);}

export function utcDatePattern(start:number,end:number){
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<start||end-start>86400000)throw new Error('Invalid operation time interval');
  const days=new Set([new Date(start).toISOString().slice(0,10),new Date(end).toISOString().slice(0,10)]);
  const months=['Jan(?:uary)?','Feb(?:ruary)?','Mar(?:ch)?','Apr(?:il)?','May','Jun(?:e)?','Jul(?:y)?','Aug(?:ust)?','Sep(?:tember)?','Oct(?:ober)?','Nov(?:ember)?','Dec(?:ember)?'];
  const alternatives=[...days].flatMap(day=>{const d=new Date(day);return [day,months[d.getUTCMonth()]+'\\s+'+d.getUTCDate()+',?\\s+'+d.getUTCFullYear()];});
  return new RegExp('(?<![0-9])(?:'+alternatives.join('|')+')(?![0-9])');
}
export async function expectPaginationEnd(scope:Locator,next=action(scope,'Next page')){
  const seen=new Set<string>();
  for(;;){
    await expect(next).toHaveCount(1);await expect(next).toBeVisible();
    if(await next.isDisabled()){await expect(next).toBeDisabled();return;}
    const signature=await scope.innerText();
    if(seen.has(signature))throw new Error('Pagination repeats an already visited page');seen.add(signature);
    await next.click();await expect.poll(()=>scope.innerText()).not.toBe(signature);
  }
}

export async function expectTagField(control:Locator,tags:string){
  const expected=tags.split(/[,\s]+/).filter(Boolean).sort();
  await expect(control).toHaveCount(1);
  await expect.poll(async()=>(await readField(control)).split(/[,\s]+/).filter(Boolean).sort()).toEqual(expected);
}

/** Bind a catalog name, description and earned count to the same readonly record. */
export async function expectCatalogBadge(group:Locator,name:string,description:string,count:number){
  await expect(group).toHaveCount(1);await expect(group).toBeVisible();let observed:unknown;
  const snapshot=()=>group.evaluateAll((roots,args)=>{
    if(roots.length!==1)return {roots:roots.length,records:0,counters:0,number:null};
    const root=roots[0];if(root.matches('form,input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return {roots:1,records:0,counters:0,number:null};const norm=(text:string)=>(text||'').replace(/\s+/g,' ').trim();
    const visible=(e:Element)=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility==='visible'};
    const readonly=(e:Element)=>{const blocked=e.closest('aside,nav,form,input,textarea,select,[contenteditable]:not([contenteditable="false"])');return visible(e)&&(!blocked||blocked!==root&&!root.contains(blocked));};
    const directRuns=(e:Element)=>{const values:string[]=[];let buffer='';for(const node of e.childNodes){if(node.nodeType===Node.TEXT_NODE)buffer+=node.textContent;else if(buffer){values.push(norm(buffer));buffer='';}}if(buffer)values.push(norm(buffer));return values;};
    const field=(e:Element,text:string)=>[e,...e.querySelectorAll('*')].some(node=>readonly(node)&&(norm((node as HTMLElement).innerText)===text||directRuns(node).includes(text)));
    const rows=[root,...root.querySelectorAll('article,li,[role="listitem"],section,div')].filter(row=>readonly(row)&&field(row,args.name)&&field(row,args.description)&&![...row.querySelectorAll('h1,h2,h3,h4,[role="heading"]')].some(h=>readonly(h)&&![args.name,'Gold','Silver','Bronze'].includes(norm((h as HTMLElement).innerText))));
    const records=rows.filter(row=>!rows.some(child=>child!==row&&row.contains(child)));
    if(records.length!==1)return {roots:1,records:records.length,counters:0,number:null};
    const record=records[0],pattern=/^(?:(?:Earn count|Earned count|Earned|Awards?)\s*:?\s*(\d+)|(\d+)\s+(?:earned|awards?))$/i;
    const labels=['Earn count '+args.name,'Earn count','Earned count'];
    const elements=[...record.querySelectorAll('output,span,dd,p,[role="status"]')].filter(readonly);
    const marked=elements.filter(e=>labels.some(label=>label.toLowerCase()===norm(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')?.split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ')||'').toLowerCase()));
    const counters=new Set<Element>(marked.filter(e=>!marked.some(child=>child!==e&&e.contains(child))));
    for(const e of elements)if(pattern.test(norm((e as HTMLElement).innerText))&&!elements.some(child=>child!==e&&e.contains(child)&&pattern.test(norm((child as HTMLElement).innerText)))&&!marked.some(m=>m!==e&&(m.contains(e)||e.contains(m))))counters.add(e);
    if(counters.size!==1)return {roots:1,records:1,counters:counters.size,number:null};
    const text=norm(([...counters][0] as HTMLElement).innerText),m=text.match(pattern),number=/^\d+$/.test(text)?Number(text):Number(m?.[1]??m?.[2]??NaN);
    return {roots:1,records:1,counters:1,number:Number.isSafeInteger(number)&&number>=0?number:null};
  },{name,description});
  try{await expect.poll(async()=>{const value=await snapshot();observed=value;return value.roots===1&&value.records===1&&value.counters===1&&value.number===count;},{message:'One readonly badge record must own its name, description and earned count'}).toBe(true);}
  catch(error){throw new Error('Badge record observation: '+JSON.stringify(observed),{cause:error});}
}

export function editGuidance(page:Page){
  return page.getByRole('main').getByText(/^How to Edit(?:\s*[:：]\s*\S[\s\S]*)?$/)
    .and(page.locator('*:not(input,textarea,select,[aria-label="Preview"] *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
}

export async function inspectOriginalRevision(page:Page,originalBody:string){
  const revision=field(page,'Rev');
  const choices=await revision.getByRole('option').evaluateAll(items=>items.filter(item=>!(item as HTMLOptionElement).disabled).map(item=>(item as HTMLOptionElement).value));
  expect(choices.length).toBeGreaterThanOrEqual(1);
  const initial=await readField(revision),candidates=choices.length>1?choices.filter(value=>value!==initial):choices;
  const errors:unknown[]=[];
  for(const value of candidates){
    await revision.selectOption(value);
    try{await expectField(field(page,'Body'),originalBody);return;}catch(error){errors.push(error);}
  }
  throw new AggregateError(errors,'No offered prior revision loaded the original body');
}
