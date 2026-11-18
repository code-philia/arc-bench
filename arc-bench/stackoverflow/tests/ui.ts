import { expect, type Page, type Locator } from '@playwright/test';

type Scope = Page | Locator;
export function pageBanner(page:Page) {
  const boundary=':not(article *,[role="article"] *,aside *,nav *,form *,[aria-label="Question post"] *,[aria-label="Question content"] *,[aria-label^="Answer by "] *,[aria-label="Comments"] *)';
  const local=page.locator(':not(article *,[role="article"] *,aside *)');
  const brand=page.getByRole('link',{name:/^Stack\s*Overflow$/i}).or(page.getByRole('img',{name:/^Stack\s*Overflow$/i}))
    .or(page.getByText(/^Stack\s*Overflow$/i)).and(local);
  const native=page.locator('header').filter({has:brand}).filter({has:rawField(page,'Search').and(local)});
  return page.getByRole('banner').or(native).and(page.locator(boundary)).filter({visible:true});
}
const pageOf=(scope:Scope):Page=>'page' in scope?scope.page():scope;
const owners = new WeakSet<Locator>();
const commentRows = new WeakSet<Locator>();
const modules = new WeakSet<Locator>();
const tagPages = new WeakSet<Locator>();
const records = new WeakSet<Locator>();
const feedScopes = new WeakMap<Locator,Locator>();
const feedControls = new Set(['Ask Question','Newest','Active','Next page','Filter']);
const credentialScopes = new WeakMap<Locator, { controls: Locator; page: Page; formId: string; submitName: string }>();
// Treat nested semantic content sections as separate boundaries. Keep this CSS
// free of :has(): Playwright 1.57 evaluates nested :scope/:has differently from
// native querySelectorAll, which can otherwise leak a child's sole action.
const child = ':is([aria-label^="Comment "],[aria-label^="Answer by "],[aria-label="Replies"],[role="region"]:not([aria-label="Comments"],[aria-label="Author"]),article,[aria-label="Comments"] li,section:not([aria-label="Comments"],[aria-label="Author"]))';
export function owned(candidate: Locator) { owners.add(candidate); return candidate; }
export function commentOwner(candidate:Locator) { owners.add(candidate);commentRows.add(candidate);return candidate; }
function discussionEditor(scope:Scope,candidate:Locator) {
  // A layout-only section around a native discussion form does not create a
  // second post. The form must remain under this named post/comment owner,
  // outside child posts/replies/authors and any other headed section.
  if(!owners.has(scope as Locator))return candidate.and(scope.locator(':not(*)'));
  return candidate.and(scope.locator(':scope form *:not(:scope article *,:scope li *,:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Answers"] *,:scope [aria-label="Replies"] *,:scope [aria-label="Author"] *,:scope [aria-label="Author information"] *,:scope aside *,:scope nav *)'))
    .locator('xpath=self::*[ancestor::*[@aria-label="Question post" or @aria-label="Question content" or starts-with(@aria-label,"Comment ") or starts-with(@aria-label,"Answer by ")]][not(ancestor::section[(h1 or h2 or h3 or h4) and not(@aria-label="Question post" or @aria-label="Question content" or @aria-label="Answers" or @aria-label="Comments" or @aria-label="Edit comment" or @aria-label="Reply" or starts-with(@aria-label,"Comment ") or starts-with(@aria-label,"Answer by "))])]');
}
function own(scope: Scope, candidate: Locator) {
  if(tagPages.has(scope as Locator)) return candidate.and(scope.locator(':scope *:not(:scope aside *,:scope nav *,:scope [aria-label="Question feed"] *,:scope [aria-label="Related tags"] *)'));
  if(modules.has(scope as Locator)) return candidate.and(scope.locator(':scope *:not(:scope aside *,:scope nav *)'));
  if(records.has(scope as Locator)) return candidate.and(scope.locator(':scope *:not(:scope aside *,:scope nav *,:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *)'));
  return owners.has(scope as Locator) ? candidate.and(scope.locator(`:scope *:not(:scope ${child} *)`)) : candidate;
}
export const content = (scope: Scope, text: string) => own(scope,scope.getByText(text,{exact:true}))
  .and(scope.locator('*:not(input,textarea,select,form,form *,[role="textbox"],[role="textbox"] *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)'))
  .filter({visible:true});
const bodyBoundary=':scope *:not(:scope [aria-label="Revision history"],:scope [aria-label="Revision history"] *,:scope [aria-label="Comments"],:scope [aria-label="Comments"] *,:scope [aria-label="Author"],:scope [aria-label="Author"] *,:scope [aria-label="Author information"],:scope [aria-label="Author information"] *,:scope [aria-label="Preview"],:scope [aria-label="Preview"] *,:scope form *,:scope nav *,:scope aside *)';
export const bodyContent=(scope:Locator,text:string)=>content(scope,text).and(scope.locator(bodyBoundary));
export function metric(scope: Scope, name: string) {
  let result=scope.getByRole('status',{name,exact:true}).or(scope.locator('output,span,dd').and(scope.getByLabel(name,{exact:true})));
  if(name==='badge notification') {
    // A textual notification is not necessarily an output element. It must
    // still belong to the displayed profile, never an editor or sidebar.
    const page=pageOf(scope);
    const profile=region(scope,'Public profile').and(scope.locator(':not(aside,aside *,nav,nav *,form,form *)'));
    const main=profile.locator('xpath=ancestor-or-self::main[1]')
      .locator('xpath=self::*[count(.//*[@aria-label="Public profile"])=1]');
    const layout=profile.locator('xpath=parent::*[not(ancestor-or-self::main)][count(.//*[@aria-label="Public profile"])=1]')
      .filter({has:navigation(page,'Profile navigation',['Activity','Reputation'])});
    const boundary=main.or(layout).locator(':scope *:not(:scope aside *,:scope nav *,:scope form *,[contenteditable]:not([contenteditable="false"]) *)');
    const explicit=result.and(boundary);
    const notices=region(main,name).and(boundary).filter({hasNot:pageOf(scope).locator('input,textarea,select,form,[contenteditable]:not([contenteditable="false"])')});
    const nested=pageOf(scope).getByRole('status',{name,exact:true}).or(pageOf(scope).locator('output,span,dd').and(pageOf(scope).getByLabel(name,{exact:true})));
    result=explicit.or(notices.filter({hasNot:nested}));
  }
  if(['Asked','Modified'].includes(name)){
    const stamp='(?:\\d{4}-\\d{2}-\\d{2}(?:T\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d+)?)?(?:Z|[+-]\\d{2}:\\d{2}))?|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \\d{1,2},? \\d{4}(?: \\d{2}:\\d{2}(?: UTC)?)?)';
    const line=new RegExp(`^${escaped(name)}\\s*:?\\s*${stamp}$`,'i');
    const plain=scope.locator('span,p,dd,time').filter({hasText:line})
      .filter({hasNot:pageOf(scope).locator('span,p,dd,time').filter({hasText:line})})
      .and(scope.locator(`*:not(form *,aside *,nav *,[aria-label="Author"] *,[aria-label="Answers"] *,[aria-label^="Answer by "] *,[aria-label^="Comment "] *,[role="status"] *,[aria-label=${JSON.stringify(name)}] *,[contenteditable]:not([contenteditable="false"]) *)`));
    result=result.or(plain);
  }
  return own(scope,result).filter({visible:true});
}
function mainHeading(scope:Scope,name:string){
  // Use the heading's accessible text, including ordinary nested spans.
  // parent::main is a structural relationship, not a choice by DOM order.
  return scope.getByRole('heading',{name,exact:true,level:1}).locator('xpath=ancestor::main[1][count(.//h1)=1][not(.//article//h1 or .//aside//h1 or .//nav//h1)]');
}
export async function readInteger(scope: Scope, name: string): Promise<number> {
  const page=pageOf(scope);
  const aliases: Record<string,string[]> = {'Score':['Score','votes'], 'Answer count':['Answer count','answers'], 'View count':['View count','views'], 'Question count':['Question count','questions']};
  const names=name==='Comment votes'&&commentRows.has(scope as Locator)?['Comment votes','Score','Helpful votes']:aliases[name]||[name];
  const label=names.map(escaped).join('|');
  const singular:Record<string,string>={'Score':'vote','Answer count':'answer','View count':'view','Question count':'question'};
  const unit=[...names,...(singular[name]?[singular[name]]:[])].map(escaped).join('|');
  const integer=/^-?\d+$/;
  const formatted=new RegExp(`^(?:(?:${label})\\s*:?\\s*(-?\\d+)|(-?\\d+)\\s+(?:${unit}))$`,'i');
  let commentValues:string[]|undefined;
  if(name==='Comment votes'&&commentRows.has(scope as Locator)) {
    await expect(scope as Locator,'One comment must own its helpful count').toHaveCount(1);
    // Resolve the comment owner once instead of expanding that owner into
    // every alias branch. Nested replies, other comments and editors remain
    // boundaries; independent explicit/inline counters still cause rejection.
    const snapshot=()=>(scope as Locator).evaluateAll((roots,args)=>roots.map(root=>{
      const inline=new RegExp(args.pattern,'i'),integer=/^-?\d+$/;
      const visible=(e:Element)=>{const r=e.getBoundingClientRect();return e instanceof HTMLElement&&r.width>0&&r.height>0&&getComputedStyle(e).visibility==='visible'};
      const local=(e:Element)=>{
        for(let p=e.parentElement;p&&p!==root;p=p.parentElement)if(p.matches('article,li,aside,nav,form,[aria-label="Replies"],[aria-label^="Comment "],[aria-label^="Answer by "],section:not([aria-label="Comments"],[aria-label="Author"])'))return false;
        return visible(e);
      };
      const named=(e:Element)=>{
        const label=e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')?.split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ')||'';
        return args.names.includes(label.trim());
      };
      const values=new Set<Element>();
      const marked=[...root.querySelectorAll('output,span,dd,[role="status"]')].filter(e=>local(e)&&named(e));
      marked.forEach(e=>values.add(e));
      for(const e of root.querySelectorAll('span,p,dd,output'))if(local(e)&&inline.test((e as HTMLElement).innerText.trim())&&!marked.some(m=>m!==e&&m.contains(e))&&![...e.querySelectorAll('span,p,dd,output')].some(c=>inline.test((c as HTMLElement).innerText.trim())))values.add(e);
      for(const e of root.querySelectorAll('span,dt,label'))if(args.names.includes((e.textContent||'').trim())){const next=e.nextElementSibling;if(next&&local(next)&&integer.test((next as HTMLElement).innerText.trim()))values.add(next)}
      return values.size?[...values].map(e=>(e as HTMLElement).innerText.trim()):null;
    }),{names,pattern:formatted.source});
    let observed=await snapshot();
    if(observed.length===1&&observed[0]!==null) {
      await expect.poll(async()=>{observed=await snapshot();return observed.length===1?(observed[0]?.length??0):observed.length;},{message:'One helpful count must belong to the comment'}).toBe(1);
      commentValues=observed[0]!;
    }
  }
  const commentAlias=new RegExp(`^(?:${names.map(escaped).join('|')})$`);
  const explicit=name==='Comment votes'&&commentRows.has(scope as Locator)?scope.getByRole('status',{name:commentAlias,exact:true}).or(scope.locator('output,span,dd').and(scope.getByLabel(commentAlias))):metric(scope,name);
  // The association is local: a dt/dd pair, adjacent label/value, a card's
  // direct heading/value, or one complete inline label/value. No digit scraping.
  const adjacent=scope.locator(':is(span,dt,label):not(input,textarea)').filter({hasText:new RegExp(`^(?:${label})$`,'i')})
    .filter({visible:true}).locator('xpath=following-sibling::*[1]').filter({hasText:/^-?\d+$/});
  const card=scope.locator(':is(section,article,div)')
    .filter({has:page.locator(':scope > :is(h1,h2,h3,h4)').filter({hasText:new RegExp(`^(?:${label})$`,'i')})})
    .locator(':scope > :is(span,output,dd,p)').filter({hasText:/^-?\d+$/});
  const inline=scope.locator('span,p,dd,output').filter({hasText:formatted})
    .filter({hasNot:page.locator('span,p,dd,output').filter({hasText:formatted})});
  const editorBoundary=name==='Title character count'?'':'form *,';
  const fallback=adjacent.or(card).or(inline)
    .and(scope.locator(`*:not(input,textarea,select,${editorBoundary}[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *,:is(output,span,dd)[aria-label=${JSON.stringify(name)}] *,[role="status"] *)`));
  // collection().all() produces fresh Locators, so WeakSet ownership marks
  // cannot be the only boundary. Apply child-content boundaries on every read.
  const boundedFallback=fallback.and(scope.locator(':scope *:not(:scope aside *,:scope nav *)'));
  const candidates=own(scope,explicit.or(boundedFallback))
    .and(scope.locator(':scope *:not(:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Author"] *)')).filter({visible:true});
  let values=commentValues;
  if(!values&&name==='Answer count') {
    // One question may repeat its answer count in its own metadata and in the
    // associated Answers section. Establish that relationship before comparing
    // values; equal numbers alone do not make two observations equivalent.
    const snapshot=()=>candidates.evaluateAll((items,pattern)=>{
      if(items.length!==1&&items.length!==2)return null;
      const format=new RegExp(pattern,'i');
      const numbers=items.map(item=>{const text=(item as HTMLElement).innerText.trim(),m=text.match(format);return /^-?\d+$/.test(text)?Number(text):m?Number(m[1]??m[2]):NaN});
      if(!numbers.every(Number.isSafeInteger))return null;
      if(items.length===1)return numbers[0];
      const owners=items.map(item=>item.closest('[aria-label="Question post"],[aria-label="Question content"],[aria-label="Answers"]'));
      const post=owners.find(owner=>owner?.getAttribute('aria-label')!=='Answers');
      const answers=owners.find(owner=>owner?.getAttribute('aria-label')==='Answers');
      if(!post||!answers||post===answers||!(post.contains(answers)||post.parentElement===answers.parentElement))return null;
      const root=post.contains(answers)?post:post.parentElement!;
      if(root.querySelectorAll('[aria-label="Answers"]').length!==1||root.querySelectorAll('[aria-label="Question post"],[aria-label="Question content"]').length!==(root===post?0:1))return null;
      return numbers[0]===numbers[1]?numbers[0]:null;
    },formatted.source);
    let observed:number|null=null;
    await expect.poll(async()=>{observed=await snapshot();return observed!==null;},{message:'Repeated answer counts must belong to the same question and agree'}).toBe(true);
    return observed!;
  }
  if(!values){
    await expect(candidates,`One visible integer must belong to ${name}`).toHaveCount(1);
    values=await candidates.evaluateAll(elements=>elements.map(element=>{
      if(!(element instanceof HTMLElement))throw new Error('Numeric output must be readable HTML');
      return element.innerText.trim();
    }));
    expect(values,'The same numeric snapshot must remain unique').toHaveLength(1);
  }
  const text=values[0];
  const matched=text.match(formatted);
  const value=integer.test(text)?text:matched?.[1]??matched?.[2];
  if(value===undefined)throw new Error(`Expected visible integer ${name}, received ${text}`);
  const number=Number(value);
  if(!Number.isSafeInteger(number))throw new Error(`Invalid integer ${name}: ${text}`);
  return number;
}

export function displayTag(scope: Scope, name: string): Locator {
  // Static tags in a summary's tag list are display content. Opening a tag
  // still uses action(), and therefore still requires a link or button.
  return own(scope,rawAction(scope,name).or(scope.locator('ul li > span,[aria-label="Tags"] > span,[role="list"] > span')
    .and(scope.getByText(name,{exact:true})))).and(scope.locator(':scope *:not(:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Author"] *,:scope [aria-label="Badges"] *,:scope aside *,:scope nav *)')).filter({visible:true});
}
export async function tagDisplayCount(scope:Scope,name:string) {
  const chips=own(scope,scope.locator('div > span').and(scope.getByText(name,{exact:true})))
    .and(scope.locator(':scope *:not(:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Author"] *,:scope [aria-label="Badges"] *,:scope aside *,:scope nav *,:scope form *,:scope [aria-label="Preview"] *)'));
  const candidates=displayTag(scope,name).or(chips).filter({visible:true});
  return candidates.evaluateAll(elements=>elements.filter(element=>{
    if(element.closest('[aria-hidden="true"],form,input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return false;
    if(element.matches('a,button,[role="button"],[role="link"],ul li > span,[aria-label="Tags"] > span,[role="list"] > span'))return true;
    if(!(element instanceof HTMLElement)||element.tagName!=='SPAN'||element.closest('p,blockquote,pre,[aria-label="Question body"]'))return false;
    const group=element.parentElement;if(!group||group.tagName!=='DIV'||[...group.children].some(child=>child.tagName!=='SPAN')||[...group.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent?.trim()))return false;
    const style=getComputedStyle(element),background=style.backgroundColor;
    const colored=background!=='transparent'&&!/^rgba\(.*,[\s]*0(?:\.0+)?\)$/.test(background);
    const outlined=parseFloat(style.borderLeftWidth)>0&&style.borderLeftStyle!=='none';
    const padded=parseFloat(style.paddingLeft)>0||parseFloat(style.paddingRight)>0;
    // Flex/grid items are blockified by layout even when their authored display
    // is inline-block. This changes neither their tag identity nor openability.
    const layout=getComputedStyle(group).display;
    const chipDisplay=['inline-block','inline-flex'].includes(style.display)||style.display==='block'&&['flex','inline-flex','grid','inline-grid'].includes(layout);
    return chipDisplay&&padded&&(colored||outlined);
  }).length);
}
export async function expectDisplayedTag(scope:Scope,name:string,count:0|1=1) {
  await expect.poll(()=>tagDisplayCount(scope,name),{message:'Tag display belongs to the current object: '+name}).toBe(count);
}

export async function expectBrand(page: Page) {
  const banner=pageBanner(page);
  const text=content(banner,'Stack Overflow');
  const images=banner.getByRole('img',{name:'Stack Overflow',exact:true}).filter({visible:true});
  const decorated=banner.getByText(/^[▤≡]\s*Stack Overflow$/).and(banner.locator('*:not(input,textarea,form *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)'));
  const pieces=text.or(images).or(decorated);
  // Text and a logo in the same home control represent one brand, while
  // independent controls or independent standalone marks remain ambiguous.
  const controls=pieces.locator('xpath=ancestor-or-self::*[self::a or self::button][1]');
  const standalone=pieces.and(banner.locator(':not(a,button,a *,button *)'));
  await expect(controls.or(standalone),'One visible Stack Overflow brand').toHaveCount(1);
  if(await images.count()) await expect.poll(()=>images.evaluateAll(elements=>elements.every(image=>image instanceof HTMLImageElement && image.complete && image.naturalWidth>0 && image.naturalHeight>0))).toBe(true);
}

export function collection(scope: Scope, prefix: string) {
  scope=feedScopes.get(scope as Locator)||scope;
  const page=pageOf(scope);
  const declared=scope.getByRole('region',{name:new RegExp(`^${escaped(prefix)} `)}).or(scope.locator(`:is(article,section,li,div)[aria-label^=${JSON.stringify(prefix+' ')}]`));
  if (!['Question','Tag'].includes(prefix)) return declared;
  // A real collection row, with an object link and its own summary/description.
  // Nested tag lists, sidebars and navigation are not question rows.
  const ancestor=prefix==='Question'?'[aria-label^="Question "]:not([aria-label="Question feed"],[aria-label="Question post"])':'[aria-label^="Tag "]';
  const rows=scope.locator(`:is(article,li,[role="listitem"]):not(:scope aside *,:scope nav *,:scope li *,:scope [role="listitem"] *,:scope article article,:scope ${ancestor} *)`)
    .filter({has:page.getByRole('link')}).filter({has:page.locator(prefix==='Tag'?'p':'p,h2,h3')})
    .filter({hasNot:page.locator(`[aria-label^=${JSON.stringify(prefix+' ')}]`)});
  return declared.or(rows);
}
export function navigation(page: Page, name: string, entries: string[]) {
  let native=page.locator('nav');
  for (const entry of entries) native=native.filter({has:action(page,entry)});
  return page.getByRole('navigation',{name,exact:true})
    .or(page.locator('nav').and(page.getByLabel(name,{exact:true}))).or(native);
}
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Current action names are explicitly prescribed by the requirements.
export function region(scope: Scope, name: string): Locator {
  scope=feedScopes.get(scope as Locator)||scope;
  const page=pageOf(scope);
  const literal = JSON.stringify(name);
  const native = scope.locator(`section, article, form, fieldset, aside, nav, li[aria-label], div[aria-label]`)
    .and(scope.getByLabel(name, { exact: true }));
  const headed = scope.locator(`:is(section,article,form,fieldset,aside,nav):has(> :is(h1,h2,h3,h4,h5,h6,legend):text-is(${literal}))`);
  const declared=scope.getByRole('region', {name, exact:true}).or(native).or(headed);
  let result=declared;
  if(name==='Question feed') {
    // A single public feed and its sibling toolbar/pagination share a module.
    // Only the finite public index headings establish this broader purpose.
    // Duplicate feeds cannot collapse to a single main and hide ambiguity.
    const title=['Home','Questions','All Questions','Interesting questions','Search results','Python tag'].map(n=>`normalize-space(.)=${JSON.stringify(n)}`).join(' or ');
    const module=`main[count(.//*[@aria-label="Question feed"])=1][count(.//h1)=1][.//h1[${title}]][not(.//*[@aria-label="Answers" or @aria-label="Question post" or @aria-label="Question content"])]`;
    const anchors=declared.and(scope.locator('[aria-label="Question feed"]'));
    const roots=anchors.locator(`xpath=ancestor::${module}[1]`);
    result=roots.or(declared.locator(`xpath=self::*[not(ancestor::${module})]`));
    feedScopes.set(result,declared);modules.add(result);
  }
  if(name==='Question post') result=result.or(scope.locator(':is(article,section)[aria-label="Question content"]:not(aside *,nav *,[aria-label="Answers"] *,[aria-label^="Answer by "] *,[aria-label="Comments"] *,article article)'));
  if(name==='Author') result=result.or(scope.locator(':is(section,div,article)[aria-label="Author information"]:not(aside *,nav *,[aria-label="Comments"] *,[aria-label="Answers"] *)'));
  if (['Tags','Users','Python tag'].includes(name)) {
    result=result.or(mainHeading(scope,name).filter({hasNot:declared}));
  }
  if (['Search suggestions','Search results'].includes(name)) {
    const lists=scope.locator('ul,ol,[role="list"],[role="listbox"]').and(scope.getByLabel(name,{exact:true}));
    result=result.or(lists.and(scope.locator(`:not([role="region"] *,section[aria-label=${literal}] *)`)));
    if(name==='Search results') result=result.or(mainHeading(scope,name).filter({hasNot:declared.or(lists)}));
  }
  for(const prefix of ['Question','Tag']) if(name.startsWith(prefix+' ') && name!=='Question post' && name!=='Question feed') {
    const title=name.slice(prefix.length+1);
    result=result.or(collection(scope,prefix).filter({has:page.getByRole('link',{name:title,exact:true})}));
  }
  if(name==='Activity content') {
    for(const category of ['Summary','Answers','Questions','Responses','Votes','Reputation']) {
      const active=`:is(a,button):text-is(${JSON.stringify(category)}):is([aria-current="page"],[aria-current="true"],[aria-selected="true"],[aria-pressed="true"],[data-state="active"])`;
      // A selected profile activity navigation and its sibling view prove purpose.
      const view=category==='Reputation'?'Reputation history':category;
      result=result.or(scope.locator(`nav[aria-label="Activity navigation"]:has(${active}) ~ section[aria-label=${JSON.stringify(view)}]`).filter({hasNot:declared}));
    }
  }
  result=own(scope,result);
  if(['Tags','Users','Search results','Search suggestions','Python tag'].includes(name))modules.add(result);
  if(name==='Python tag')tagPages.add(result);
  if((name.startsWith('Question ') && !['Question post','Question feed'].includes(name))||name.startsWith('Tag '))records.add(result);
  if (name === 'Question post' || name.startsWith('Answer by ') || name.startsWith('Comment ')) owners.add(result);
  if(name.startsWith('Comment '))commentRows.add(result);
  return result;
}
export async function directReadableTextCount(scope:Locator,text:string,includeRoot=false) {
  const roots=includeRoot?scope:scope.and(scope.page().locator(':not(*)'));
  const candidates=own(scope,scope.locator('p,div,span,blockquote,pre')).and(scope.locator('*:not(input,textarea,select,form,form *,nav *,aside *,[role="textbox"],[role="textbox"] *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).and(scope.locator(bodyBoundary)).or(roots).filter({visible:true});
  return candidates.evaluateAll((elements,expected)=>{
    const normalize=(s:string)=>s.replace(/\s+/g,' ').trim();
    let matches=0;
    for(const el of elements){let run='';for(const node of el.childNodes){if(node.nodeType===Node.TEXT_NODE)run+=node.textContent||'';else if(node.nodeType!==Node.COMMENT_NODE){if(normalize(run)===normalize(expected))matches++;run=''}}if(normalize(run)===normalize(expected))matches++}
    return matches;
  },text);
}
export async function catalogPagination(page:Page,name:'Tags'|'Users') {
  const catalog=region(page,name).filter({visible:true});await expect(catalog).toHaveCount(1);
  const unique=catalog.locator(`xpath=self::*[not(ancestor::main[count(.//*[@aria-label=${JSON.stringify(name)}])>1])]`);
  const main=unique.and(page.locator(`[aria-label=${JSON.stringify(name)}]`)).locator(`xpath=ancestor::main[1][count(.//*[@aria-label=${JSON.stringify(name)}])=1][count(.//h1)=1]`).filter({has:page.getByRole('heading',{name,exact:true,level:1})});
  const bounded=(s:Locator)=>s.locator(':scope *:not(:scope article *,:scope li *,:scope [aria-label^="Tag "] *,:scope aside *,:scope nav *)');
  return action(unique,'Next page').and(bounded(unique)).or(main.getByRole('button',{name:'Next page',exact:true}).or(main.getByRole('link',{name:'Next page',exact:true})).and(bounded(main))).filter({visible:true});
}
export function reputationContribution(scope:Locator,reason:string,change:number,parentTitle:string) {
  const signed=(change>0?'+':'')+change;
  const line=new RegExp(`^\\s*${escaped(reason)}\\s*${escaped(signed)}(?=\\s|${escaped(parentTitle)}|$)`);
  const page=pageOf(scope),types='article,li,[role="listitem"],div';
  const contribution=/^\s*(?:question|answer) upvoted\s*[+-]\d+/;
  const controls=page.getByRole('button').or(page.getByRole('link'));
  const nested=page.locator(types).filter({hasText:contribution}).filter({has:controls});
  const rows=scope.locator(types).filter({hasText:contribution}).filter({has:controls})
    .filter({hasNot:nested}).and(scope.locator(':scope *:not(:scope aside *,:scope nav *,:scope form *)'));
  return rows.filter({hasText:line}).filter({has:action(page,parentTitle)}).filter({visible:true});
}
function rawAction(scope: Scope, name: string): Locator {
  const feed=feedScopes.get(scope as Locator);
  const source=feed&&!feedControls.has(name)?feed:scope;
  const identity = name;
  let result = source.getByRole('button',{name:identity,exact:true}).or(source.getByRole('link',{name:identity,exact:true}));
  if(['Newest','Active'].includes(name)) {
    // Finite presentation suffixes only; never a substring match on user data.
    result=result.or(scope.getByRole('button',{name:new RegExp(`^${escaped(name)}\\s*(?:Selected|✓)$`),exact:true})
      .and(scope.locator('[aria-pressed="true"],[aria-selected="true"],[data-state="active"]')));
  }
  if(feed&&feedControls.has(name)) result=result.and(scope.locator(':scope *:not(:scope aside *,:scope nav *,:scope article *,:scope section:not([aria-label="Question feed"],[role="toolbar"]) *,:scope [aria-label^="Question "]:not([aria-label="Question feed"]) *,:scope [aria-label="Answers"] *,:scope [aria-label="Comments"] *)'))
    .locator('xpath=self::*[not(ancestor::div[(h2 or h3 or h4) and not(@role="toolbar")])]');
  if (owners.has(scope as Locator)) {
    // A post's comment/reply actions cannot stand in for its own actions.
    // The Comments container itself may contain the post's Add a comment entry.
    result = result.and(scope.locator(`:scope :is(button,a,[role="button"],[role="link"],input):not(:scope ${child} *)`));
  }
  let bounded=own(scope,result);
  if(['Add Reply','Add comment','Save edits'].includes(name)&&owners.has(scope as Locator)) {
    const fieldName=name==='Add Reply'?'Reply':'Comment';
    const forms=scope.locator('form').filter({has:pageOf(scope).getByRole('textbox',{name:fieldName,exact:true}).or(pageOf(scope).getByLabel(fieldName,{exact:true}))});
    const controls=forms.getByRole('button',{name:identity,exact:true}).or(forms.getByRole('link',{name:identity,exact:true}));
    bounded=bounded.or(discussionEditor(scope,controls));
  }
  return bounded.filter({visible:true});
}
function rawField(scope: Scope, name: string): Locator {
  // Labels and placeholders are both ordinary user-visible field descriptions.
  const aliases:Record<string,string[]>={X:['X','X link or username'],GitHub:['GitHub','GitHub link or username']};
  const identity=aliases[name]?new RegExp(`^(?:${aliases[name].map(escaped).join('|')})$`):name;
  const candidate=scope.getByLabel(identity,{exact:true}).or(scope.getByPlaceholder(identity,{exact:true}))
    .or(scope.getByRole('textbox',{name:identity,exact:true})).or(scope.getByRole('searchbox',{name:identity,exact:true})).or(scope.getByRole('combobox',{name:identity,exact:true}));
  const writableKinds=scope.locator('input,textarea,select,[role="textbox"],[role="searchbox"],[role="combobox"],[contenteditable]:not([contenteditable="false"])');
  const bounded=own(scope,candidate.and(writableKinds));
  return (['Comment','Reply'].includes(name)?bounded.or(discussionEditor(scope,candidate.and(writableKinds))):bounded).filter({visible:true});
}
export const minimumPasswordMessage=/(?:minimum(?: of)?|at least)\s+(?:8|eight)\s+characters/i;
export const upvoteDescription=/up\s*vote/i;
export function publicIdentityAction(directory:Locator,name:string,email:string,allowNameOnly=false) {
  const page=directory.page();
  const rows=directory.locator('article,li,[role="listitem"]').filter({has:content(page,email)})
    .filter({hasNot:page.locator('article,li,[role="listitem"]')})
    .and(directory.locator(':scope *:not(:scope form *,:scope aside *,:scope nav *)'));
  const qualified=action(directory,`${name} ${email}`).or(action(owned(rows),name));
  if(!allowNameOnly)return qualified;
  // A different visible email identifies a different record, even when names
  // coincide. A hidden/decorative email must not disqualify a name-only record.
  const emailText='[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
  const unqualified=action(directory,name).and(directory.locator(`:scope *:not(:scope :is(article,li,[role="listitem"]):has(:text-matches(${JSON.stringify(emailText)}):visible) *)`));
  return qualified.or(unqualified);
}
export function searchField(page:Page) {
  return field(pageBanner(page),'Search').and(page.locator('input:not([type]),input[type="text"],input[type="search"],[role="textbox"],[role="searchbox"],[contenteditable="true"]'));
}
export function acceptedAnswer(scope:Scope) {
  return own(scope,scope.getByText(/^(?:✓\s*)?Accepted answer$/)).and(scope.locator('*:not(input,textarea,form,form *,nav *,aside *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
}
export async function profileReputation(page:Page,name:string) {
  const view=profileView(page,name);await expect(view).toHaveCount(1);await expect(profileText(view,name)).toBeVisible();
  const main=view.locator('xpath=ancestor-or-self::main[1]');
  const hasMain=await main.count()>0;
  // A profile and its summary may be siblings in a content layout without main.
  // Stay in the profile's immediate layout: nested other profiles cannot supply it.
  const layout=hasMain?main:view.locator('xpath=parent::*[not(ancestor-or-self::main)][count(.//*[@aria-label="Public profile"])=1]')
    .filter({has:navigation(page,'Profile navigation',['Activity','Reputation'])});
  let summaries=region(layout,'Activity Summary').or(region(layout,'Summary')).filter({visible:true});
  if(!hasMain)summaries=summaries.and(layout.locator(':scope > :is(section,article,div)'));
  const summary=summaries.filter({has:metric(page,'Reputation')});
  if(await summary.count()) {
    await expect(summary).toHaveCount(1);const value=await readInteger(summary,'Reputation');
    const publicProfile=region(layout,'Public profile');
    if(await metric(publicProfile,'Reputation').count()) {await expect(publicProfile).toHaveCount(1);expect(await readInteger(publicProfile,'Reputation'),'Profile and summary reputation must agree').toBe(value);}
    return value;
  }
  return readInteger(view,'Reputation');
}
const submitTypes = 'button,input[type="submit"],input[type="button"],[role="button"]';
export function action(scope: Scope, name: string): Locator {
  const credential = credentialScopes.get(scope as Locator);
  if (!credential || name !== credential.submitName) return rawAction(scope,name);
  let result = rawAction(credential.controls,name).and(credential.page.locator(submitTypes));
  if (credential.formId) result = result.or(rawAction(credential.page,name)
    .and(credential.page.locator(`${submitTypes.split(',').map(type=>`${type}[form=${JSON.stringify(credential.formId)}]`).join(',')}`)));
  return result;
}
export function field(scope: Scope, name: string): Locator {
  const credential = credentialScopes.get(scope as Locator);
  if (!credential) return rawField(scope,name);
  let result = rawField(credential.controls,name);
  if (credential.formId) result = result.or(rawField(credential.page,name)
    .and(credential.page.locator(`[form=${JSON.stringify(credential.formId)}]`)));
  return result;
}
async function credentialForms(page: Page, name: string, submitName: string): Promise<Locator> {
  const submit = rawAction(page,submitName).and(page.locator(submitTypes));
  const native = page.locator('form').filter({has:rawField(page,'Email')})
    .filter({has:rawField(page,'Password')}).filter({visible:true});
  let forms = native.filter({has:submit});
  // External native submit controls must name a real owner through form=.
  const ids = await submit.and(page.locator('button[form],input[form]')).evaluateAll(elements =>
    [...new Set(elements.flatMap(element => {
      const owner = (element as HTMLButtonElement | HTMLInputElement).form;
      return owner?.id ? [owner.id] : [];
    }))]);
  for (const id of ids) forms = forms.or(native.and(page.locator(`form[id=${JSON.stringify(id)}]`)));
  const plain = region(page,name).or(page.getByRole('form',{name,exact:true}))
    .or(page.locator(`:is(main,div):has(> :is(h1,h2,h3):text-is(${JSON.stringify(name)}))`))
    .and(page.locator(':not(form)')).filter({hasNot:page.locator('form,[role="form"]')})
    .filter({has:rawField(page,'Email')}).filter({has:rawField(page,'Password')})
    .filter({has:submit}).filter({visible:true});
  return forms.or(plain);
}
async function credentialForm(page: Page, name: string, submitName: string): Promise<Locator> {
  const controls = await credentialForms(page,name,submitName);
  await expect(controls,'One login form must own the credentials and submit action').toHaveCount(1);
  const native = await controls.evaluate(element=>element instanceof HTMLFormElement);
  const formId = native ? await controls.getAttribute('id') || '' : '';
  // The login view may also contain navigation below the form. Field writes and
  // submission remain bound to the validated form, never to this broader view.
  let view = controls;
  if (native) {
    const declared = region(page,name).and(page.locator(':not(form)')).filter({has:controls});
    const main = page.getByRole('main').filter({has:controls}).filter({hasNot:declared});
    const views = declared.or(main).filter({visible:true});
    if (await views.count()) {
      await expect(views,'Login navigation must have an unambiguous view').toHaveCount(1);
      view = views;
    }
  } else owners.add(controls);
  credentialScopes.set(view,{controls,page,formId,submitName});
  const email = field(view,'Email'), password = field(view,'Password'), submit = action(view,submitName);
  for (const target of [email,password,submit]) {
    await expect(target,'Login fields and submit must each be unique').toHaveCount(1);
    await expect(target).toBeVisible();
  }
  if (native) {
    if (formId) await expect(page.locator(`form[id=${JSON.stringify(formId)}]`),'External form ownership cannot use duplicate IDs').toHaveCount(1);
    const owner = await controls.elementHandle();
    try {
      for (const target of [email,password,submit]) {
        const belongs = await target.evaluate((element,form) => {
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement || element instanceof HTMLSelectElement) return element.form === form;
          return element.closest('form') === form;
        },owner);
        expect(belongs,'Credential or submit control belongs to a different form').toBe(true);
      }
    } finally { await owner?.dispose(); }
  } else {
    const owner = await controls.elementHandle();
    try {
      for (const target of [email,password,submit]) {
        const belongs = await target.evaluate((element,scope) => {
          for (let ancestor = element.parentElement; ancestor && ancestor !== scope; ancestor = ancestor.parentElement) {
            if (ancestor.matches('form,[role="form"],[role="region"],article,section')) return false;
          }
          return !!scope?.contains(element);
        },owner);
        expect(belongs,'A plain login area cannot borrow fields or submit from a nested owner').toBe(true);
      }
    } finally { await owner?.dispose(); }
  }
  return view;
}
export const loginForms = (page: Page) => credentialForms(page,'Log in','Sign in');
export const loginForm = (page: Page) => credentialForm(page,'Log in','Sign in');
export const signupForms = (page: Page) => credentialForms(page,'Sign up','Create account');
export const signupForm = (page: Page) => credentialForm(page,'Sign up','Create account');

export function profileView(page: Page, name: string): Locator {
  const declared=region(page,'Public profile');
  const main=page.getByRole('main').filter({has:page.getByRole('heading',{name,exact:true,level:1})})
    .filter({has:navigation(page,'Profile navigation',['Activity','Reputation'])}).filter({hasNot:declared});
  const result=declared.or(main);modules.add(result);return result;
}
export function profileText(view: Locator, text: string): Locator {
  // A named profile can itself be the text-bearing element (no inner span).
  // Keep that original representation, while excluding editable echoes.
  const page=view.page();
  const root=view.and(page.getByText(text,{exact:true})).filter({hasNot:page.locator('input,textarea,select,form,[role="textbox"],[contenteditable]:not([contenteditable="false"])')});
  // A public value may share a metadata line, separated by visible bullets.
  // Match the whole segment, not a substring of a longer location or title.
  const segment=new RegExp(`(?:^|\\s+[·|]\\s*)${escaped(text)}(?:\\s*[·|]\\s+|$)`);
  const segments=view.locator('p,span,dd').filter({hasText:segment})
    .filter({hasNot:page.getByText(text,{exact:true})})
    .filter({hasNot:page.locator('p,span,dd').filter({hasText:segment})})
    .and(view.locator('*:not(form *,nav *,aside *,input,textarea,select,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)'));
  return content(view,text).or(root).or(segments).filter({visible:true});
}
export function saveConfirmation(page: Page): Locator {
  const message=/^(?:(?:Changes|Your changes)(?: have been| were)? saved(?: successfully)?|(?:Your )?Profile (?:(?:has been|was) )?(?:successfully )?(?:saved|updated)(?: successfully)?(?: and copied to all public communities)?|(?:Saved|Updated) successfully)[.!]?$/i;
  const semantic=page.getByRole('status').or(page.getByRole('alert')).filter({hasText:message});
  const plain=page.locator('p,div,span').filter({hasText:message})
    .filter({hasNot:page.locator('p,div,span').filter({hasText:message})})
    .and(page.locator(':not([role="status"] *,[role="alert"] *,aside *,nav *)'));
  return semantic.or(plain).and(page.locator('*:not(input,textarea,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
}
const tagIntegerText='(?:\\d{1,3}(?:,\\d{3})+|\\d+)';
const tagCounterText=new RegExp(`^(?:(?:Question count|questions)\\s*:?\\s*(${tagIntegerText})(?:\\s*questions?)?|(${tagIntegerText})\\s*questions?)$`,'i');
export async function tagDescription(card: Locator): Promise<string> {
  await expect(card,'One tag record must own its description').toHaveCount(1);
  await expect(card).toBeVisible();
  const paragraphs=card.locator(':scope p:not(:scope aside *,:scope nav *,:scope form *,:scope article *,:scope [aria-label^="Tag "] *,[contenteditable]:not([contenteditable="false"]) *)')
    .filter({visible:true}).filter({hasNotText:tagCounterText});
  expect(await paragraphs.count(),'A count cannot replace a tag description').toBeGreaterThan(0);
  const parts=(await paragraphs.allTextContents()).map(value=>value.trim()).filter(value=>value.length>0);
  expect(parts.length,'A tag description must contain readable text').toBeGreaterThan(0);
  return parts.join('\n');
}
export async function tagQuestionCount(card: Locator): Promise<number> {
  await expect(card,'One tag record must own its counter').toHaveCount(1);
  const page=card.page(),name=/^(?:Question count|questions)$/i,integer=new RegExp(`^${tagIntegerText}$`);
  const marked=card.getByRole('status',{name}).or(card.locator('output,span,dd,p').and(card.getByLabel(name)));
  const pairedValue=page.locator('span,dt,label').filter({hasText:/^\s*(?:Question count|questions)\s*$/i}).filter({visible:true})
    .locator('xpath=following-sibling::*[1]').filter({hasText:integer});
  const inline=card.locator('p,span,dd,output,div').filter({hasText:tagCounterText})
    .filter({hasNot:page.getByRole('heading')})
    .filter({hasNot:pairedValue})
    .filter({hasNot:page.locator('p,span,dd,output,div').filter({hasText:tagCounterText})});
  const adjacent=card.locator('*').and(pairedValue);
  const headed=card.locator('section,article,div').filter({has:page.locator(':scope > :is(h1,h2,h3,h4)').filter({hasText:name})})
    .locator(':scope > :is(p,span,dd,output)').filter({hasText:integer});
  const unmarked=inline.or(adjacent).or(headed).and(card.locator(':not([role="status"] *,:is(output,span,dd,p)[aria-label="Question count"] *)'));
  const value=marked.or(unmarked).and(card.locator(':scope *:not(input,textarea,select,:scope [aria-label^="Tag "] *,:scope [aria-label^="Comment "] *,:scope [aria-label^="Answer by "] *,:scope [aria-label="Author"] *,:scope article *,:scope aside *,:scope nav *,[contenteditable]:not([contenteditable="false"]),[contenteditable]:not([contenteditable="false"]) *)')).filter({visible:true});
  await expect(value,'A tag has one visible question count').toHaveCount(1);
  const text=(await value.innerText()).replace(/\s+/g,' ').trim(),match=text.match(tagCounterText);
  const raw=integer.test(text)?text:match?.[1]??match?.[2];
  if(raw===undefined)throw new Error('Invalid tag question count: '+text);
  const count=Number(raw.replace(/,/g,''));
  if(!Number.isSafeInteger(count)||count<0)throw new Error('Invalid tag question count: '+text);
  return count;
}
