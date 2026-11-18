import {expect,type Locator,type Page,type ElementHandle} from '@playwright/test';
type Scope=Page|Locator;
const pageOf=(scope:Scope):Page=>'page' in scope?scope.page():scope;
const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const openedChoices=new WeakMap<Page,{control:ElementHandle;popup:ElementHandle}>();

/** Read an explicit state; absence alone is not evidence of an inactive vote. */
export async function activeState(control:Locator):Promise<boolean|null>{
 return control.evaluate(element=>{
  for(const attr of ['aria-pressed','aria-selected','aria-checked']){const value=element.getAttribute(attr);if(value==='true'||value==='false')return value==='true'}
  if(element instanceof HTMLInputElement&&['checkbox','radio'].includes(element.type))return element.checked;
  const state=element.getAttribute('data-state');if(['active','selected','checked','on'].includes(state||''))return true;if(['inactive','unselected','unchecked','off'].includes(state||''))return false;
  const positive=['active','selected','checked','upvoted','downvoted','voted'],negative=['inactive','unselected','unchecked'];
  if(positive.some(c=>element.classList.contains(c)))return true;
  if(negative.some(c=>element.classList.contains(c)))return false;
  // A stylesheet that declares this control's selected variant establishes
  // the meaning of the absent class. A plain unmarked button remains unknown.
  const hasStateRule=(rules:CSSRuleList):boolean=>[...rules].some(rule=>{
   if(!(rule instanceof CSSStyleRule))return 'cssRules' in rule?hasStateRule((rule as CSSGroupingRule).cssRules):false;
   return rule.selectorText.split(',').some(selector=>positive.some(token=>{
    if(!selector.includes('.'+token))return false;
    const base=selector.replace(new RegExp('\\.'+token+'(?![\\w-])','g'),'');
    try{return !!base.trim()&&element.matches(base)}catch{return false}
   }));
  });
  for(const sheet of document.styleSheets)try{if(hasStateRule(sheet.cssRules))return false}catch{}
  return null;
 });
}

function choice(scope:Scope,name:string){
 return scope.getByLabel(name,{exact:true}).or(scope.getByRole('combobox',{name,exact:true}))
  .or(scope.getByRole('button',{name,exact:true})).filter({visible:true});
}
async function choices(scope:Scope,name:string,control:Locator){
 const page=pageOf(scope),ids=(await control.getAttribute('aria-controls')||'').split(/\s+/).filter(Boolean);
 const controlled=ids.length?page.locator(ids.map(id=>'[id='+JSON.stringify(id)+']').join(',')).filter({visible:true}):page.locator(':not(*)');
 const local=control.getByRole('option').filter({visible:true});
 if(await local.count())return local;
 if(await controlled.count()){
  await expect(controlled,'One popup must belong to '+name).toHaveCount(1);
  return controlled.getByRole('option').or(controlled.getByRole('menuitemradio')).or(controlled.getByRole('button')).filter({visible:true});
 }
 // Opening a single fresh listbox proves the popup relationship when no
 // aria-controls is supplied; an unrelated already-open listbox is rejected.
 const lists=page.getByRole('listbox').filter({visible:true});
 const already=await lists.count();
 if(!ids.length&&already){
  const previous=openedChoices.get(page);
  if(!previous||already!==1||await control.getAttribute('aria-expanded')!=='true'||
    !await control.evaluate((element,owner)=>element===owner,previous.control)||
    !await lists.evaluate((element,popup)=>element===popup,previous.popup))throw new Error('Unrelated or ambiguous open choice popup');
  return lists.getByRole('option').filter({visible:true});
 }
 if(await control.getAttribute('aria-expanded')!=='true')await control.click();
 if(ids.length){const popup=page.locator(ids.map(id=>'[id='+JSON.stringify(id)+']').join(',')).filter({visible:true});await expect(popup).toHaveCount(1);return popup.getByRole('option').or(popup.getByRole('menuitemradio')).or(popup.getByRole('button')).filter({visible:true})}
 const nested=control.getByRole('option').filter({visible:true});if(await nested.count())return nested;
 await expect(lists,'One expanded choice popup').toHaveCount(1);
 await expect(control).toHaveAttribute('aria-expanded','true');
 const previous=openedChoices.get(page);await previous?.control.dispose();await previous?.popup.dispose();
 const owner=await control.elementHandle(),popup=await lists.elementHandle();
 if(!owner||!popup)throw new Error('Choice popup changed while associating its owner');
 openedChoices.set(page,{control:owner,popup});
 return lists.getByRole('option').filter({visible:true});
}
export async function expectChoice(scope:Scope,name:string,label:string){
 const control=choice(scope,name);await expect(control).toHaveCount(1);
 await expect.poll(async()=>{
  if(await control.evaluate(el=>el instanceof HTMLSelectElement))return control.locator('option:checked').allTextContents();
  const explicit=await control.getAttribute('aria-valuetext');
  if(explicit!==null)return [explicit];
  const text=(await control.innerText()).trim().replace(new RegExp('^'+escape(name)+'\\s*:?\\s*'),'');
  return [text];
 }).toEqual([label]);
}
export async function selectChoice(scope:Scope,name:string,label:string){
 const control=choice(scope,name);await expect(control).toHaveCount(1);
 if(await control.evaluate(el=>el instanceof HTMLSelectElement)){
  await expect(control.getByRole('option',{name:label,exact:true}),'One choice must have this label').toHaveCount(1);
  await control.selectOption({label});
 }
 else{const options=await choices(scope,name,control);const selected=options.filter({hasText:new RegExp('^'+escape(label)+'$')});await expect(selected).toHaveCount(1);await selected.click()}
 await expectChoice(scope,name,label);
}
export async function expectChoiceOptions(scope:Scope,name:string,labels:string[]){
 const control=choice(scope,name);await expect(control).toHaveCount(1);
 const options=await control.evaluate(el=>el instanceof HTMLSelectElement)?control.locator('option'):await choices(scope,name,control);
 await expect.poll(async()=>(await options.allTextContents()).map(x=>x.trim()).sort()).toEqual([...labels].sort());
}
export async function choiceLabels(scope:Scope,name:string){
 const control=choice(scope,name);await expect(control).toHaveCount(1);
 const options=await control.evaluate(el=>el instanceof HTMLSelectElement)?control.locator('option:not(:disabled)'):await choices(scope,name,control);
 const labels=(await options.allTextContents()).map(x=>x.trim());
 if(!labels.length||labels.some(x=>!x)||new Set(labels).size!==labels.length)throw new Error('Choice labels must identify enabled alternatives uniquely');
 return labels;
}
export async function expectSwitch(scope:Scope,name:string,value:boolean){
 const control=scope.getByLabel(name,{exact:true}).or(scope.getByRole('checkbox',{name,exact:true})).or(scope.getByRole('switch',{name,exact:true})).or(scope.getByRole('button',{name,exact:true})).filter({visible:true});
 await expect(control).toHaveCount(1);await expect.poll(()=>activeState(control)).toBe(value);
}
export async function setSwitch(scope:Scope,name:string,value:boolean){
 const control=scope.getByLabel(name,{exact:true}).or(scope.getByRole('checkbox',{name,exact:true})).or(scope.getByRole('switch',{name,exact:true})).or(scope.getByRole('button',{name,exact:true})).filter({visible:true});
 await expect(control).toHaveCount(1);const before=await activeState(control);if(before===null)throw new Error('Unknown switch state');if(before!==value)await control.click();await expectSwitch(scope,name,value);
}
