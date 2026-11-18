import {activeState,choiceLabels,selectChoice} from './controls';
export {selectChoice,expectChoice,expectChoiceOptions,setSwitch,expectSwitch} from './controls';
import { createHash, randomBytes } from 'node:crypto';
import { expect, test as base, type Page, type Locator, type Browser, type TestInfo } from '@playwright/test';
import { accountRoles, historicalAccounts, password, body, answerBody, commentBody, identityFor, retryTitle, questionVoteGain } from './fixtures/data';
export { expect };
import { region, action, field, content, metric, navigation, owned, loginForm, signupForm, readInteger, profileView, profileText, saveConfirmation, searchField, acceptedAnswer, commentOwner, directReadableTextCount, bodyContent, publicIdentityAction, pageBanner, expectDisplayedTag } from './ui';
export { pageBanner, expectDisplayedTag, region, action, field, collection, loginForm, loginForms, signupForm, signupForms, displayTag, expectBrand, profileView, profileText, content, saveConfirmation, tagDescription, tagQuestionCount, searchField, acceptedAnswer, minimumPasswordMessage, profileReputation, catalogPagination, reputationContribution, upvoteDescription } from './ui';
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
export async function expectAuthorBadges(author: Locator, names: string[] = ['Teacher']) {
  await expect(author).toHaveCount(1);await expect(author).toBeVisible();
  for(const name of names){
    const badge=content(author,name).and(author.locator(':scope *:not(form,aside,nav,:scope form *,:scope aside *,:scope nav *,:scope [aria-label="Comments"] *,:scope [aria-label="Answers"] *)'));
    await expect(badge,'The actual author must display the earned badge '+name).toHaveCount(1);await expect(badge).toBeVisible();
  }
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
  await expect(action(pageBanner(page),'Log in')).toBeVisible();
  await expect(action(pageBanner(page),'Sign up')).toBeVisible();
}
export async function openLogin(page: Page) {
  await entry(page);
  await action(pageBanner(page), 'Log in').click();
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
  await action(pageBanner(page),'Sign up').click();
  const form=await signupForm(page);
  await field(form,'Email').fill(identity.email);
  await field(form,'Password').fill(identity.password);
  await action(form,'Create account').click();
  await expect(action(pageBanner(page),identity.email)).toBeVisible();
  signedIn.set(page,{...identity,displayName:identity.email});
  if (identity.displayName !== identity.email) {
    await action(pageBanner(page),identity.email).click();
    await action(page,'Edit profile').click();
    await field(page,'Display name').fill(identity.displayName);
    await saveProfile(page,identity.displayName);
    const verification=await freshSession(page,identity);
    let failure:unknown;
    try {
      await verifyProfileIdentity(verification.page,identity.displayName);
    } catch(error){failure=error;throw error;}
    finally {try{await verification.close();}catch(error){if(failure)throw new AggregateError([failure,error],'Identity verification and context cleanup failed');throw error;}}
  }
  signedIn.set(page,identity);
}
export async function verifyProfileIdentity(page:Page,name:string) {
  await action(pageBanner(page),name).click();
  await expect(profileText(profileView(page,name),name)).toBeVisible();
  await page.reload();
  await ownProfile(page,name);
  await expect(profileText(profileView(page,name),name)).toBeVisible();
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
  await expect(action(pageBanner(page),identity.displayName)).toBeVisible();
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
export async function publicDiscovery(page:Page) {
  const current=await region(page,'Question feed').count()===1||await region(page,'Search results').count()===1;
  if(current&&await post(page).count()===0&&await region(page,'Public profile').count()===0&&await field(page,'Title').count()===0)return;
  const banner=pageBanner(page),brand=banner.getByRole('link',{name:/^(?:[▤≡]\s*)?Stack\s*Overflow$/i}).or(banner.getByRole('button',{name:/^(?:[▤≡]\s*)?Stack\s*Overflow$/i}));
  if(await brand.count()){await expect(brand).toHaveCount(1);await brand.click()}
  else{const home=action(mainNav(page),'Home');await expect(home).toHaveCount(1);await home.click()}
  await expect(region(page,'Question feed')).toHaveCount(1);await expect(region(page,'Question feed')).toBeVisible();
}
export async function openQuestions(page:Page) {
  await publicDiscovery(page);await action(mainNav(page),'Questions').click();await expect(region(page,'Question feed')).toBeVisible();
}
export async function openMembers(page:Page) {
  await publicDiscovery(page);await action(mainNav(page),'Users').click();await expect(region(page,'Users')).toBeVisible();
}
export async function openQuestion(page: Page, title: string) {
  await publicDiscovery(page);
  // Public Search is used rather than assuming the question is on page one.
  await searchField(page).fill(title);
  await searchField(page).press('Enter');
  await action(region(page, 'Search results'), title).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(post(page)).toBeVisible();
}
type PublicMemberProof={ownedQuestion:string;excludedQuestion:string};
async function memberCaptionAction(page:Page,identity:Identity,proof:PublicMemberProof) {
  const directory=region(page,'Users'),eligible=publicIdentityAction(directory,identity.displayName,identity.email,true);
  const rows=directory.locator('article,li,[role="listitem"]').filter({has:content(page,proof.ownedQuestion)})
    .filter({hasNot:content(page,proof.excludedQuestion)}).filter({has:action(page,identity.displayName)})
    .filter({hasNot:page.locator('article,li,[role="listitem"]')})
    .and(directory.locator(':scope *:not(:scope form *,:scope aside *,:scope nav *)'));
  return eligible.and(rows.locator(':scope *:not(:scope form *,:scope aside *,:scope nav *)'));
}
async function publicMemberFromContributions(page:Page,identity:Identity,proof:PublicMemberProof):Promise<Locator> {
  if(proof.ownedQuestion===proof.excludedQuestion)throw new Error('Public member proof must distinguish the two contributions');
  const directory=region(page,'Users'),entries=new Map<string,string>(),seen=new Set<string>();
  const signature=()=>directory.evaluate(element=>JSON.stringify({text:(element as HTMLElement).innerText,links:[...element.querySelectorAll('a')].map(link=>link.getAttribute('href'))}));
  for(;;){
    const current=await signature();if(seen.has(current))throw new Error('Member catalog repeated before it was exhausted');seen.add(current);
    const candidates=publicIdentityAction(directory,identity.displayName,identity.email,true);
    const links=await candidates.evaluateAll(elements=>elements.map(element=>({link:element instanceof HTMLAnchorElement||element.getAttribute('role')==='link',href:element.getAttribute('href')})));
    for(const entry of links){
      if(!entry.link||!entry.href||entry.href==='#')throw new Error('Namesake member has no observable public profile destination; no positional selection is allowed');
      const url=new URL(entry.href,page.url());if(url.origin!==new URL(page.url()).origin||!['http:','https:'].includes(url.protocol))throw new Error('Member profile must be an application public destination');
      if(entries.has(entry.href))throw new Error('Duplicate public member entries remain ambiguous');entries.set(entry.href,url.href);
    }
    const next=action(directory,'Next page');if(!await next.count())break;await expect(next).toHaveCount(1);if(!await next.isEnabled())break;
    await next.click();await expect.poll(signature).not.toBe(current);
  }
  if(!entries.size)throw new Error('No public namesake member destinations were available');
  const matches:string[]=[];
  for(const [href,url] of entries){
    const probe=await page.context().newPage();let failure:unknown;
    try{
      await probe.goto(url);await expect(profileText(profileView(probe,identity.displayName),identity.displayName)).toBeVisible();
      await action(profileNav(probe),'Activity').click();await action(activityNav(probe),'Questions').click();
      const questions=region(probe,'Activity content');await expect(questions).toBeVisible();
      await expect.poll(async()=>await action(questions,proof.ownedQuestion).count()>0||await action(questions,proof.excludedQuestion).count()>0,{message:'The public contribution must identify the visited namesake'}).toBe(true);
      const owned=await action(questions,proof.ownedQuestion).count(),excluded=await action(questions,proof.excludedQuestion).count();
      if(owned>1||excluded>1)throw new Error('Duplicate public contributions do not establish one member');
      if(owned===1&&excluded===0)matches.push(href);
    }catch(error){failure=error;throw error;}
    finally{try{await probe.close()}catch(error){if(failure)throw new AggregateError([failure,error],'Public member inspection and cleanup failed');throw error}}
  }
  expect(matches,'Exactly one public profile must own the intended contribution').toHaveLength(1);
  const selected=()=>publicIdentityAction(directory,identity.displayName,identity.email,true).and(directory.locator(`[href=${JSON.stringify(matches[0])}]`));
  if(!await selected().count()){
    await action(mainNav(page),'Users').click();
    const filter=field(directory,'Filter by user').or(field(directory,'Search users'));if(await filter.count()){await expect(filter).toHaveCount(1);await filter.fill(identity.displayName)}
    const pages=new Set<string>();
    while(!await selected().count()){
      const current=await signature();if(pages.has(current))throw new Error('Could not return to the proven public member entry');pages.add(current);
      const next=action(directory,'Next page');await expect(next).toHaveCount(1);await expect(next).toBeEnabled();await next.click();await expect.poll(signature).not.toBe(current);
    }
  }
  await expect(selected()).toHaveCount(1);await expect(selected()).toBeVisible();return selected();
}
export async function publicUserAction(page: Page, identity: Identity, distinguishEmail=false,proof?:PublicMemberProof) {
  const directory=region(page,'Users');
  await expect(directory).toBeVisible();
  const target=publicIdentityAction(directory,identity.displayName,identity.email,!distinguishEmail);
  const alternatives=publicIdentityAction(directory,identity.displayName,identity.email,true);
  const ready=async()=>await target.count()>0||!!proof&&await alternatives.count()>0;
  const fromProof=async()=>{
    const caption=await memberCaptionAction(page,identity,proof!);if(await caption.count()){await expect(caption,'One member entry must own its public contribution').toHaveCount(1);return caption}
    return publicMemberFromContributions(page,identity,proof!);
  };
  const search=field(directory,'Filter by user').or(field(directory,'Search users'));
  if(await search.count()) {await expect(search).toHaveCount(1);await search.fill(identity.displayName);await expect.poll(ready).toBe(true);if(!await target.count()&&proof)return fromProof();await expect(target).toHaveCount(1);await expect(target).toBeVisible();return target;}
  const next=action(directory,'Next page');
  const seen=new Set<string>();
  for(;;){
    await expect.poll(async()=>await ready() || await next.count()===1 && await next.isEnabled()).toBe(true);
    if(!await target.count()&&proof&&await alternatives.count())return fromProof();
    if(await target.count()){await expect(target,'The public identity must be unique').toHaveCount(1);await expect(target).toBeVisible();return target;}
    const signature=await directory.innerText();
    if(seen.has(signature))throw new Error('Users pagination repeated without reaching the registered identity');
    seen.add(signature);
    await expect(next,'Registered members must be reachable in the public catalog').toHaveCount(1);
    await expect(next).toBeEnabled();await next.click();
    await expect.poll(()=>directory.innerText()).not.toBe(signature);
  }
}
export async function expectPublicMember(page:Page,identity:Identity,proof:PublicMemberProof) {
  await expect(profileText(profileView(page,identity.displayName),identity.displayName)).toBeVisible();
  await action(profileNav(page),'Activity').click();
  await action(activityNav(page),'Questions').click();
  const questions=region(page,'Activity content');
  await expect(action(questions,proof.ownedQuestion)).toHaveCount(1);
  await expect(action(questions,proof.ownedQuestion)).toBeVisible();
  await expect(action(questions,proof.excludedQuestion)).toHaveCount(0);
}
export async function ownProfile(page: Page, name = signedInName(page)) {
  await action(pageBanner(page), name).click();
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
  for (const tag of tags.split(',').map(value => value.trim()).filter(Boolean)) await expectDisplayedTag(post(page),tag);
}
export async function expectBody(scope: Locator, text: string, includeRecordRoot=false) {
  await expect(scope).toBeVisible();
  const exact=bodyContent(scope,text);
  if(await exact.count())await expect(exact).toBeVisible();
  else await expect.poll(()=>directReadableTextCount(scope,text,includeRecordRoot)).toBe(1);
}
export async function expectCommentTimestamp(scope: Locator, period?:{start:number;end:number},metadata?:{author:string;body:string}) {
  const date = /^(?:just now|(?:a|an|\d+)\s+(?:secs?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?|years?)\s+ago|\d{4}-\d{2}-\d{2}(?:[T ][0-9:.]+(?:Z|[+-]\d{2}:\d{2})?)?(?: UTC)?|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?(?:\s+(?:at\s+)?\d{1,2}:\d{2})?)$/i;
  const boundary=scope.locator(':scope *:not(:scope [aria-label="Replies"] *,:scope [aria-label^="Comment "] *,:scope aside *,:scope nav *,:scope form *,button,button *,input,textarea,select,blockquote,blockquote *,pre,pre *)');
  const time = scope.locator('time').and(boundary).filter({visible:true});
  const escape=(text:string)=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const combined=metadata?new RegExp(`^(?!${escape(metadata.body)}$)${escape(metadata.author)}\\s+(${date.source.slice(1,-1)})(?:\\s+\\(edited\\))?$`):null;
  const inline=combined?scope.locator('span,small,p').filter({hasText:combined})
    .filter({hasNot:scope.page().locator('span,small,p').filter({hasText:combined})})
    .and(boundary).and(scope.locator(':not(p,p *,[aria-label="Comment body"],[aria-label="Comment body"] *)')):scope.locator(':not(*)');
  const candidates = time.or(scope.getByText(date,{exact:true}).and(scope.locator('*:not(time,time *)')).and(boundary)).or(inline).filter({visible:true});
  await expect(candidates).toHaveCount(1);
  const raw=(await candidates.innerText()).trim();
  const displayed=combined?.exec(raw)?.[1]??raw;
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
    }else if(/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/.test(displayed)){
      const instant=Date.parse(displayed.replace(' ','T')+'Z');
      expect(Number.isFinite(instant)).toBe(true);
      expect(instant).toBeLessThanOrEqual(period.end);
      expect(instant+60000).toBeGreaterThan(period.start);
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
const topLevelComments = (thread: Locator, candidate: Locator) => candidate
  .and(thread.locator('*:not(:scope [aria-label="Replies"] *,:scope [aria-label^="Comment "] *)'))
  // A plain list/layout wrapper is not a second comment. A named parent
  // comment or a native parent record with its own readable body still is.
  .locator('xpath=self::*[not(ancestor::*[(self::article or self::li) and (p[normalize-space(.)!=""] or span[normalize-space(.)!=""])])]');
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
  return createPublicQuestion(browser,owner,title,tags);
}
export async function createSearchControl(browser:Browser,owner:Account) {
  // Independent identity: a title derived from the target's nonce or old
  // title may itself legitimately match that target query.
  return createPublicQuestion(browser,owner,'Independently published search control '+randomBytes(16).toString('hex'));
}
async function createPublicQuestion(browser:Browser,owner:Account,title:string,tags='node.js,http,retry') {
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
export async function expectQuestionAbsent(page: Page, title: string,controlTitle:string) {
  if(!controlTitle||controlTitle===title)throw new Error('Negative search requires a different, known published control');
  if(!title.trim()||controlTitle.toLowerCase().includes(title.trim().toLowerCase()))throw new Error('Negative search requires a control excluded by the target query');
  if(await post(page).count()||await region(page,'Public profile').count()||await field(page,'Title').count())await publicDiscovery(page);
  const search=searchField(page),results=region(page,'Search results').filter({visible:true});
  const empty=/^(?:No (?:matching )?(?:questions|results)(?: (?:found|match(?:ed)?(?: your search)?))?(?: for .+)?|Your search returned no results|0 (?:matching )?(?:questions|results))[.!]?$/i;
  const emptyText=page.getByText(empty).and(page.locator('*:not(aside *,nav *,form *,[aria-hidden="true"],[aria-hidden="true"] *,[aria-label^="Question "]:not([aria-label="Question feed"]) *,[aria-label^="Answer by "] *,[aria-label^="Comment "] *,[aria-label="Public profile"] *,[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
  const submit=async(query:string)=>{await search.fill(query);await search.press('Enter')};
  const control=async()=>{await submit(controlTitle);await expect(results).toHaveCount(1);await expect(action(results,controlTitle)).toHaveCount(1);await expect(action(results,controlTitle)).toBeVisible()};
  let priorEmpty:string[]=[];
  const outcome=async()=>{
    const groups=await results.count();if(groups>1)return {valid:false,empty:false};
    if(groups===0){const notices=await emptyText.allInnerTexts();const fresh=notices.length===1&&!priorEmpty.includes(notices[0]);return {valid:fresh,empty:fresh}}
    const notices=await emptyText.and(results.locator('*')).count();if(notices>1)return {valid:false,empty:false};
    const entries=results.getByRole('link').or(results.getByRole('button')).and(results.locator(':scope *:not(:scope nav *,:scope form *,:scope [role="toolbar"] *)'));
    const count=await entries.count(),text=(await results.innerText()).replace(/^\s*Search results\s*/i,'').trim();
    const noMatches=count===0&&(notices===1||text==='');
    return {valid:noMatches||count>0&&notices===0,empty:noMatches};
  };
  // Demonstrate a responsive search before accepting absence. An inert empty
  // page and an unchanged positive result must not pass a negative assertion.
  await control();priorEmpty=await emptyText.allInnerTexts();await submit('search-probe-'+randomBytes(12).toString('hex'));
  await expect.poll(async()=>{const state=await outcome();return state.valid&&state.empty&&await action(results,controlTitle).count()===0},{message:'Search must visibly respond to a nonmatching query'}).toBe(true);
  await control();priorEmpty=await emptyText.allInnerTexts();await submit(title);
  await expect.poll(async()=>{const state=await outcome();return state.valid&&await action(results,title).count()===0&&await action(results,controlTitle).count()===0},{message:'The target query must replace the unrelated positive control and exclude the rejected title'}).toBe(true);
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
  const page=scope.page(),nativeTypes='li,article,[role="listitem"]',parent=action(page,parentTitle);
  const native=page.locator(nativeTypes).filter({has:parent}).filter({hasText:text});
  const directBody=page.locator(':scope > :is(p,span,div)').filter({hasText:new RegExp('^'+text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')});
  const otherRecord=page.locator('div').filter({has:page.locator(':scope > p').filter({hasText:/\S/})}).filter({has:page.getByRole('button').or(page.getByRole('link'))});
  const plain=page.locator('div').filter({has:directBody}).filter({has:parent})
    .filter({hasNot:page.locator(nativeTypes)}).filter({hasNot:otherRecord});
  const row=owned(native.filter({hasNot:native}).or(plain).and(scope.locator(':scope *:not(:scope form *,:scope aside *,:scope nav *)')).filter({visible:true}));
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
export async function expectSavedModification(scope:Locator,period:{start:number;end:number}) {
  await expect(scope,'One current question must own its modification metadata').toHaveCount(1);
  const signals=metric(scope,'Modified').and(scope.locator(':scope *:not(:scope aside *,:scope nav *,:scope form *,:scope [aria-label="Answers"] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Comments"] *,:scope [aria-label="Author"] *)'));
  const interval=(raw:string):[number,number]|null=>{
    const text=raw.trim().replace(/^(?:Modified|Edited)\s*:?\s*/i,'');
    let date=text;
    const human=text.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) (\d{1,2}),? (\d{4})$/i);
    if(human){const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(human[1].slice(0,3).toLowerCase())+1;date=`${human[3]}-${String(month).padStart(2,'0')}-${human[2].padStart(2,'0')}`}
    if(/^\d{4}-\d{2}-\d{2}$/.test(date)){const start=Date.parse(date+'T00:00:00Z');if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,10)!==date)return null;return [start,start+86400000-1]}
    const stamp=text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+-]\d{2}:\d{2})$/i);
    if(!stamp)return null;const start=Date.parse(text);if(!Number.isFinite(start))return null;
    const precision=stamp[2]?10**(3-stamp[2].length):stamp[1]?1000:60000;
    return [start,start+precision-1];
  };
  await expect.poll(async()=>{
    const values=await signals.evaluateAll(elements=>elements.filter(element=>!elements.some(other=>other!==element&&element.contains(other))).map(element=>(element as HTMLElement).innerText));
    if(!values.length)return false;
    let start=period.start,end=period.end;
    for(const value of values){const range=interval(value);if(!range)return false;start=Math.max(start,range[0]);end=Math.min(end,range[1])}
    return start<=end;
  },{message:'Current question modification metadata must agree with this saved revision'}).toBe(true);
}
export async function expectActive(control: Locator, active: boolean) {
  await expect(control).toHaveCount(1);
  await expect.poll(()=>activeState(control)).toBe(active);
}
/** The named filter flow may use a dialog, a form, or an ordinary panel. */
export function selectionDialog(page:Page){
  const candidates=page.locator('form,section,div,[role="dialog"]')
    .filter({has:field(page,'Filter title')}).filter({has:action(page,'Save filter')}).filter({visible:true});
  return candidates.filter({hasNot:candidates});
}

/** Public contributions can repeat a title without disclosing a private vote. */
export async function expectPrivateVotesHidden(scope:Locator,parentTitle:string){
  await expect(scope).toHaveCount(1);await expect(scope).toBeVisible();
  await expect(region(scope,'Votes').filter({visible:true})).toHaveCount(0);
  const page=scope.page();
  const reason=page.getByText(/^(?:up|down)\s*vote(?:d)?(?:\s+(?:on|at)\s+.+)?$/i,{exact:true})
    .and(page.locator(':not(button,button *,a,a *,nav *,aside *,[aria-label="Replies"] *)')).filter({visible:true});
  const nativeTypes='article,li,tr,[role="listitem"]';
  const native=scope.locator(nativeTypes).filter({has:action(page,parentTitle)}).filter({has:reason});
  const partialRecord=page.locator('div,section').filter({has:action(page,parentTitle).or(reason)});
  const plain=scope.locator('div,section').filter({has:action(page,parentTitle)}).filter({has:reason})
    .filter({hasNot:page.locator(nativeTypes)}).filter({hasNot:partialRecord});
  const rows=native.filter({hasNot:page.locator(nativeTypes)}).or(plain).filter({visible:true});
  await expect(rows,'Private vote records must not appear in a public summary').toHaveCount(0);
  const direct=scope.locator('article,li,tr,div,section,[role="listitem"]')
    .filter({has:action(page,parentTitle)}).filter({hasNot:page.locator(nativeTypes)}).filter({visible:true});
  await expect.poll(()=>direct.evaluateAll(records=>records.filter(record=>[...record.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&/^(?:up|down)\s*vote(?:d)?\s*$/i.test(node.textContent?.trim()||''))).length),{message:'Inline private vote reasons must not be disclosed'}).toBe(0);
}

export async function waitForCommentExpiry(period:{start:number;end:number}){
  if(!Number.isFinite(period.start)||!Number.isFinite(period.end)||period.end<period.start)throw new Error('Invalid publication interval');
  const deadline=period.end+301_000;
  while(Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,Math.min(1000,deadline-Date.now())));
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
  const open = () => openPythonTag(page);
  await open();
  const watched = action(region(page,'Python tag'),'Unwatch tag');
  const unwatched = action(region(page,'Python tag'),'Watch tag');
  await expect(watched.or(unwatched)).toHaveCount(1);
  const original = await watched.count() === 1;
  if (original) {await watched.click();await expect(unwatched).toBeVisible()}
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
export async function openPythonTag(page:Page) {
  const target=region(page,'Python tag').filter({visible:true});
  if(await target.count()){await expect(target).toHaveCount(1);return}
  await publicDiscovery(page);await action(mainNav(page),'Tags').click();
  const catalog=region(page,'Tags').filter({visible:true});
  await expect.poll(async()=>await target.count()>0||await catalog.count()>0).toBe(true);
  if(await target.count()){await expect(target).toHaveCount(1);return}
  await expect(catalog).toHaveCount(1);await action(region(catalog,'Tag python'),'python').click();
  await expect(target).toHaveCount(1);await expect(target).toBeVisible();
}
export async function checkPythonWatchPreference(page:Page) {
  await withUnwatchedPython(page,async()=>{
    await action(region(page,'Python tag'),'Watch tag').click();
    await expect(action(region(page,'Python tag'),'Unwatch tag')).toBeVisible();
    await openQuestions(page);await expectCurrent(action(mainNav(page),'Questions'));await page.reload();
    await openQuestions(page);await expectCurrent(action(mainNav(page),'Questions'));
    const watched=action(region(page,'Watched tags'),'python');
    await expect(watched).toHaveCount(1);await expect(watched).toBeVisible();
    await watched.click();
    await action(region(page,'Python tag'),'Unwatch tag').click();
    await expect(action(region(page,'Python tag'),'Watch tag')).toBeVisible();
    await openQuestions(page);await expectCurrent(action(mainNav(page),'Questions'));
    await expect(action(region(page,'Watched tags'),'python')).toHaveCount(0);
  });
}
export async function checkPythonWatchIsolation(watcher: Page, other: Page) {
  // Establish both baselines before either Watch operation; normalizing the
  // second account afterwards could conceal a global preference leak.
  await withUnwatchedPython(watcher,()=>withUnwatchedPython(other,async()=>{
    await action(region(watcher,'Python tag'),'Watch tag').click();
    await expect(action(region(watcher,'Python tag'),'Unwatch tag')).toBeVisible();
    await action(mainNav(other),'Questions').click();
    await expectCurrent(action(mainNav(other),'Questions'));
    await expect(action(region(other,'Watched tags'),'python')).toHaveCount(0);
    await openPythonTag(other);
    await expect(action(region(other,'Python tag'),'Watch tag')).toBeVisible();
    await expect(action(region(other,'Python tag'),'Unwatch tag')).toHaveCount(0);
    await watcher.reload();
    await openPythonTag(watcher);
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
  const legacy=/^(Edit|Delete) (question|answer|comment)$/.exec(name)?.[1];
  const controls = (legacy?action(scope,name).or(action(scope,legacy)):action(scope,name)).filter({ visible: true });
  // A hidden action or a visibly disabled action is unavailable to the user.
  for (const control of await controls.all()) await expect(control).toBeDisabled();
}

export async function beforeRecords(first:Locator,second:Locator) {
 await expect(first).toHaveCount(1);await expect(second).toHaveCount(1);
 await expect.poll(async()=>{const a=await first.boundingBox(),b=await second.boundingBox();return !!a&&!!b&&(a.y<b.y||a.y===b.y&&a.x<b.x)}).toBe(true);
}
export async function openRevisionHistory(owner:Locator,expectedText?:string) {
 const page=owner.page();await expect(owner).toHaveCount(1);
 const before=await region(page,'Revision history').filter({visible:true}).allInnerTexts();
 await action(owner,'Timeline').click();
 let chosen:Locator|undefined;
 await expect.poll(async()=>{
  if(await owner.count()!==1)return false;
  const local=region(owner,'Revision history').filter({visible:true}),count=await local.count();
  if(count>1)return false;
  if(count===1){if(expectedText&&!(await local.innerText()).includes(expectedText))return false;chosen=local;return true}
  // A parallel history without an owner caption is safe only for a single
  // current answer in this question and a fresh, expected revision result.
  if(!expectedText)return false;
  const question=post(page);if(await question.count()!==1||await owner.and(question.locator('*')).count()!==1)return false;
  const layout=question.locator('xpath=parent::*');if(await region(layout,'Question post').count()!==1)return false;
  const answers=region(layout,'Answers');if(await answers.count()!==1)return false;
  const records=answers.locator('[aria-label^="Answer by "],article:has(> header):has(> p)')
    .and(answers.locator(':scope *:not(:scope [aria-label="Comments"] *,:scope [aria-label="Revision history"] *,:scope aside *,:scope nav *)'));
  if(await records.count()!==1||await records.and(owner).count()!==1)return false;
  const parallel=region(layout,'Revision history').and(layout.locator(':scope *:not(:scope aside *,:scope nav *,:scope form *,:scope [aria-label="Preview"] *)')).filter({visible:true});
  if(await parallel.count()!==1)return false;
  const text=await parallel.innerText(),normalized=text.replace(/\s+/g,' ').trim();if(!text.includes(expectedText)||before.some(old=>old.replace(/\s+/g,' ').trim()===normalized))return false;
  chosen=parallel;return true;
 },{message:'Revision history must belong to the triggered answer and show the expected saved revision'}).toBe(true);
 await expect(chosen!).toHaveCount(1);await expect(chosen!).toBeVisible();return chosen!;
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
  // Prove editing purpose from its controls. A main landmark is optional;
  // layouts above separate mains cannot join an editor to another page's text.
  const editor=page.locator('main,section,article,form,div').filter({has:field(page,'Title')})
    .filter({has:field(page,'Body')}).filter({has:field(page,'Edit Summary')})
    .filter({has:action(page,'Save edits')}).filter({has:action(page,'Cancel')})
    .and(page.locator(':not(:has(main))'));
  // Preserve the established standalone-instructions contract in a unique
  // main. This does not join guidance in a second main to an active editor.
  const standalone=page.getByRole('main').locator('xpath=self::*[count(//main | //*[@role="main"])=1]');
  return page.getByText(/^How to Edit(?:\s*[:：]\s*\S[\s\S]*)?$/)
    .and(editor.or(standalone).locator('*:not(input,textarea,select,nav *,[aria-label="Preview"] *,[aria-label="Question post"] *,[aria-label="Question content"] *,[aria-label^="Answer by "] *,[aria-label^="Comment "] *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
}

export async function inspectOriginalRevision(page:Page,originalBody:string){
  const revision=field(page,'Rev');
  const choices=await choiceLabels(page,'Rev');
  expect(choices.length).toBeGreaterThanOrEqual(1);
  const candidates=choices;
  const errors:unknown[]=[];
  for(const value of candidates){
    await selectChoice(page,'Rev',value);
    try{await expectField(field(page,'Body'),originalBody);return;}catch(error){errors.push(error);}
  }
  throw new AggregateError(errors,'No offered prior revision loaded the original body');
}

export async function expectFormattedPreview(page:Page,text:string,kind:'Bold'|'Italic'|'Code') {
  const preview=region(page,'Preview');await expect(preview).toHaveCount(1);await expect(preview).toBeVisible();
  await expect.poll(()=>preview.evaluate((root,args)=>{
    const normalize=(value:string)=>value.replace(/\s+/g,' ').trim();
    if(root instanceof HTMLElement&&root.isContentEditable)return false;
    const excluded='input,textarea,select,aside,nav,[contenteditable]:not([contenteditable="false"]),[aria-hidden="true"]';
    const local=(element:Element)=>{for(let owner:Element|null=element;owner&&owner!==root;owner=owner.parentElement)if(owner.matches(excluded))return false;return true};
    const visible=(element:Element)=>{const rect=element.getBoundingClientRect(),style=getComputedStyle(element);return rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&style.display!=='none'&&local(element)};
    const matches=[...root.querySelectorAll('*')].filter(element=>element instanceof HTMLElement&&visible(element)&&normalize(element.innerText)===normalize(args.text));
    const leaves=matches.filter(element=>!matches.some(other=>element!==other&&element.contains(other)));
    if(leaves.length!==1)return false;
    const walker=document.createTreeWalker(leaves[0],NodeFilter.SHOW_TEXT),texts:Element[]=[];
    for(let node=walker.nextNode();node;node=walker.nextNode())if(node.textContent?.trim()&&node.parentElement&&visible(node.parentElement))texts.push(node.parentElement);
    if(!texts.length)return false;
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
    return texts.every(element=>{
      const style=getComputedStyle(element);
      if(args.kind==='Bold')return Number(style.fontWeight)>=600;
      if(args.kind==='Italic')return /^(?:italic|oblique)/.test(style.fontStyle);
      if(!context)return false;
      context.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const narrow=context.measureText('iiii').width,wide=context.measureText('WWWW').width;
      return narrow>0&&Math.abs(narrow-wide)<0.1;
    });
  },{text,kind}),{message:'The selected body must render its formatting in its own Preview'}).toBe(true);
}
