/** Real-browser checks of alternate UI structures, independent of dsf markup. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(process.argv[2] ?? 'typescript');
const pw = require('@playwright/test');
const source = readFileSync(join(root, 'arc-bench/bookstack/tests/support/ui.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length ?? 0, 0);
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputText)(name => {
  assert.equal(name, '@playwright/test');
  return { ...pw, expect: pw.expect.configure({ timeout: 600 }) };
}, mod, mod.exports);
const ui = mod.exports;
function loadHelpers() {
  const helperSource = readFileSync(join(root, 'arc-bench/bookstack/tests/helpers.ts'), 'utf8');
  const helperCode = ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const helperModule = { exports: {} };
  new Function('require', 'module', 'exports', helperCode)(name => {
    if (name === './support/ui') return ui;
    if (name === './fixtures/data') return { ACCOUNT: { nickname: 'Admin', email: 'admin@example.com', password: 'password' } };
    if (name === '@playwright/test') return { ...pw, expect: pw.expect.configure({ timeout: 600 }) };
    throw new Error(name);
  }, helperModule, helperModule.exports);
  return helperModule.exports;
}
const checks = [];
const browser = await pw.chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const check = async (name, body) => { await body(); checks.push({ name, result: 'passed' }); };
  for (const markup of [
    '<button onclick="window.clicked=true">Open book</button>',
    '<a href="#opened" onclick="window.clicked=true">Open book</a>',
    '<div role="menuitem" tabindex="0" onclick="window.clicked=true">Open book</div>',
    '<div role="tab" tabindex="0" onclick="window.clicked=true">Open book</div>',
    '<div tabindex="0" onclick="window.clicked=true">Open book</div>',
    '<button><span>Open book</span></button>',
  ]) {
    await check(`action variant ${checks.length + 1}`, async () => {
      await page.setContent(markup);
      await pw.expect(ui.entry(page, 'Open book')).toHaveCount(1);
      await ui.entry(page, 'Open book').click();
      if (markup.includes('window.clicked')) assert.equal(await page.evaluate(() => window.clicked), true);
    });
  }
  await check('static text is not a control; duplicate controls are not hidden', async () => {
    await page.setContent('<p>Open book</p>');
    assert.equal(await ui.entry(page, 'Open book').count(), 0);
    await page.setContent('<button>Open book</button><a href="#">Open book</a>');
    assert.equal(await ui.entry(page, 'Open book').count(), 2);
  });
  await check('button navigation in a header without a nav role', async () => {
    await page.setContent('<header><button>Shelves</button><button>Books</button><button>Login</button></header><main><a href="#">Books</a></main>');
    const target = await ui.navigationEntry(page, 'Books');
    assert.equal(await target.evaluate(element => element.tagName), 'BUTTON');
  });
  for (const markup of [
    '<section aria-label="Book list"><button>Own book</button></section>',
    '<ul aria-label="Book list"><li><a href="#">Own book</a></li></ul>',
    '<div aria-label="Book list"><button>Own book</button></div>',
    '<div><h2>Book list</h2><ul><li><a href="#">Own book</a></li></ul></div>',
  ]) {
    await check(`collection variant ${checks.length + 1}`, async () => {
      await page.setContent(markup + '<div><h2>Shelf list</h2><ul><li><button>Other item</button></li></ul></div>');
      const scope = await ui.region(page, 'Book list');
      assert.equal(await ui.entry(scope, 'Own book').count(), 1);
      assert.equal(await ui.entry(scope, 'Other item').count(), 0);
    });
  }
  await check('ambiguous collection labels fail rather than choosing the first', async () => {
    await page.setContent('<section aria-label="Book list"></section><section aria-label="Book list"></section>');
    await assert.rejects(() => ui.region(page, 'Book list'));
  });
  await check('unlabelled pages are scoped to their owning book, not the entire page', async () => {
    await page.setContent('<section><h1>Own book</h1><div><a href="#">Own page</a></div></section><aside><a href="#">Other page</a></aside>');
    const scope = await ui.region(page, 'Page list', 'Own book');
    assert.equal(await ui.entry(scope, 'Own page').count(), 1);
    assert.equal(await ui.entry(scope, 'Other page').count(), 0);
  });
  await check('chapter collection may be called Chapters without forcing its role', async () => {
    await page.setContent('<section aria-label="Chapters"><h2>Chapters</h2><a href="#">Own chapter</a></section>');
    const scope = await ui.region(page, 'Chapter list');
    assert.equal(await ui.entry(scope, 'Own chapter').count(), 1);
  });
  await check('password and rich-text fields do not need a textbox role', async () => {
    await page.setContent('<label>Password<input type="password"></label><div contenteditable="true" aria-label="Description"></div>');
    await ui.field(page, 'Password').fill('secret');
    await ui.field(page, 'Description').fill('Own description');
    await ui.expectFieldValue(page, 'Password', 'secret');
    await ui.expectFieldValue(page, 'Description', 'Own description');
  });
  await check('native checkbox and custom switch expose the same selected behavior', async () => {
    for (const markup of [
      '<label>Remember Me<input type="checkbox"></label>',
      '<button role="switch" aria-label="Remember Me" aria-checked="false" onclick="this.setAttribute(\'aria-checked\',this.getAttribute(\'aria-checked\')===\'true\'?\'false\':\'true\')">Remember Me</button>',
      '<button aria-pressed="false" onclick="this.setAttribute(\'aria-pressed\',this.getAttribute(\'aria-pressed\')===\'true\'?\'false\':\'true\')">Remember Me</button>',
    ]) {
      await page.setContent(markup);
      await ui.expectToggleState(page, 'Remember Me', false);
      await ui.setToggle(page, 'Remember Me', true);
      await ui.expectToggleState(page, 'Remember Me', true);
    }
  });
  await check('unreadable toggle state is not assumed to be false', async () => {
    await page.setContent('<button>Remember Me</button>');
    await assert.rejects(() => ui.expectToggleState(page, 'Remember Me', false));
  });
  await check('favorite state works without aria-pressed', async () => {
    await page.setContent('<a href="#" onclick="event.preventDefault();this.textContent=this.textContent===\'Favorite\'?\'Unfavorite\':\'Favorite\'">Favorite</a>');
    await ui.expectFavoriteState(page, false);
    await ui.entry(page, 'Favorite').click();
    await ui.expectFavoriteState(page, true);
    await ui.entry(page, 'Unfavorite').click();
    await ui.expectFavoriteState(page, false);
  });
  await check('title can be a semantic heading or plain visible title', async () => {
    for (const markup of ['<h1>Own title</h1>', '<div>Own title</div>']) {
      await page.setContent(markup);
      await ui.heading(page, 'Own title');
    }
  });
  await check('a navigation label cannot satisfy a title during page loading', async () => {
    await page.setContent('<header><a href="#">Books</a></header><main id="content"></main>');
    await page.evaluate(() => setTimeout(() => {
      document.querySelector('#content').innerHTML = '<h1>Books</h1>';
    }, 80));
    await ui.heading(page, 'Books');
    assert.equal(await page.locator('h1').textContent(), 'Books');
  });
  await check('semantic text fields read write and assert native and contenteditable implementations', async () => {
    for (const control of ['<input>', '<textarea></textarea>', '<div contenteditable="true"></div>']) {
      await page.setContent(`<label>Page title${control}</label>`);
      // contenteditable uses an explicit label rather than placeholder.
      if (control.includes('contenteditable')) await page.locator('[contenteditable]').evaluate(el => el.setAttribute('aria-label', 'Page title'));
      const field = ui.textField(page, 'Page title');
      assert.equal(field.inputValue, undefined);
      await field.expectVisible(); await field.fill('Own title');
      assert.equal(await field.read(), 'Own title'); await field.expectValue('Own title');
      await field.fill('Changed title'); await field.expectValue('Changed title');
      await field.fill(''); await field.expectValue('');
    }
  });
  await check('semantic actions and collections preserve open count absence and ownership', async () => {
    for (const role of ['button', 'link', 'menuitem', 'tab']) {
      await page.setContent(`<div aria-label="Pages"><div role="${role}" tabindex="0" onclick="window.opened='own'">Own page</div></div><aside><button>Other page</button></aside>`);
      const pages = ui.collection(page, 'Page list');
      await pages.expectVisible(); await pages.item('Own page').expectCount(1);
      await pages.item('Other page').expectAbsent(); await pages.item('Own page').open();
      assert.equal(await page.evaluate(() => window.opened), 'own');
      assert.equal(pages.item('Own page').click, undefined);
    }
    await page.setContent('<button>Save</button><a href="#">Save</a>');
    await assert.rejects(() => ui.action(page, 'Save').activate());
  });
  await check('unlabelled chapters use book context and reject static entry text', async () => {
    await page.setContent('<section><h1>Own book</h1><button onclick="window.chapterOpened=true">Own chapter</button></section><aside><button>Other chapter</button></aside>');
    const chapters = ui.collection(page, 'Chapter list', { owner: 'Own book' });
    await chapters.item('Other chapter').expectAbsent(); await chapters.item('Own chapter').open();
    assert.equal(await page.evaluate(() => window.chapterOpened), true);
    await page.setContent('<section><h1>Own book</h1><p>Own chapter</p></section>');
    await assert.rejects(() => chapters.item('Own chapter').open());
  });
  await check('semantic toggle and favorite support read and idempotent set', async () => {
    await page.setContent('<label>Remember Me<input type="checkbox"></label><button onclick="this.textContent=this.textContent===\'Favorite\'?\'Unfavorite\':\'Favorite\'">Favorite</button>');
    const remember = ui.toggle(page, 'Remember Me');
    assert.equal(await remember.read(), false);
    await remember.set(true); await remember.set(true); await remember.expectState(true);
    await remember.set(false); await remember.expectState(false);
    const favorite = ui.favorite(page);
    assert.equal(await favorite.read(), false);
    await favorite.set(true); await favorite.set(true); await favorite.expectState(true);
    await favorite.set(false); await favorite.expectState(false);
  });
  await check('real metadata helper reads and writes contenteditable tag rows', async () => {
    const helpers = loadHelpers();
    await page.setContent('<input aria-label="Name"><textarea aria-label="Description"></textarea><div contenteditable="true" aria-label="Tag Name"></div><div contenteditable="true" aria-label="Tag Name"></div><div contenteditable="true" aria-label="Tag Value">old</div>');
    await helpers.metadata(page, 'Own book', 'Own description', 'alpha,beta');
    await helpers.expectMetadata(page, 'Own book', 'Own description', 'beta,alpha');
    assert.equal(await ui.textField(page, 'Tag Value').read(), '');
  });
  await check('page editor accepts purpose labels and placeholders with exact read write and clear', async () => {
    for (const markup of [
      '<label>Title<input></label><label>Content<textarea></textarea></label>',
      '<input placeholder="Title"><textarea placeholder="Body"></textarea>',
      '<input aria-label="Page title"><div contenteditable="true" aria-label="Page content"></div>',
    ]) {
      await page.setContent(markup);
      const editor = ui.pageEditor(page);
      await editor.title.fill('Own title'); await editor.body.fill('Own body');
      await editor.title.expectValue('Own title'); await editor.body.expectValue('Own body');
      assert.equal(await editor.body.read(), 'Own body');
      await editor.body.fill(''); await editor.body.expectValue('');
    }
  });
  await check('editor ambiguity and static content cannot satisfy a writable field', async () => {
    await page.setContent('<textarea aria-label="Content"></textarea><textarea aria-label="Body"></textarea>');
    await assert.rejects(() => ui.pageEditor(page).body.fill('Own body'));
    await page.setContent('<p>Content</p>');
    await assert.rejects(() => ui.pageEditor(page).body.fill('Own body'));
  });
  await check('new book action supports reference-backed labels and performs the operation', async () => {
    for (const label of ['New Book', 'Create New Book']) {
      await page.setContent(`<button onclick="window.bookAction='${label}'">${label}</button>`);
      await ui.action(page, 'Create New Book').activate();
      assert.equal(await page.evaluate(() => window.bookAction), label);
    }
  });
  await check('competing create-book actions are not resolved by DOM order', async () => {
    await page.setContent('<button>New Book</button><button>Create New Book</button>');
    await assert.rejects(() => ui.action(page, 'Create New Book').activate());
  });
  await check('all content collection names accept purpose headings without crossing collections', async () => {
    for (const [canonical, label] of [['Shelf list', 'Shelves'], ['Book list', 'Books'], ['Page list', 'Pages'], ['Chapter list', 'Chapters']]) {
      await page.setContent(`<section><h2>${label}</h2><ul><li><button>Own item</button></li></ul></section><aside><button>Other item</button></aside>`);
      const items = ui.collection(page, canonical);
      await items.item('Own item').expectCount(1);
      await items.item('Other item').expectAbsent();
    }
  });
  await check('opening label wrappers retain exact object identity including regexp characters', async () => {
    for (const prefix of ['', 'Open ', 'View ', 'Read ']) {
      await page.setContent(`<section aria-label="Books"><button onclick="window.itemOpened='own'">${prefix}Own [book].1</button><button>Open Own [book].10</button><button>Edit Own [book].1</button></section><aside><button>Open Own [book].1</button></aside>`);
      await ui.collection(page, 'Book list').item('Own [book].1').expectCount(1);
      await ui.collection(page, 'Book list').item('Own [book].1').open();
      assert.equal(await page.evaluate(() => window.itemOpened), 'own');
    }
  });
  await check('linked card includes description without imposing a complete accessible name', async () => {
    await page.setContent('<section aria-label="Books"><a href="#own" onclick="window.cardOpened=true"><h3>Own book</h3><p>Saved description</p></a></section>');
    await ui.collection(page, 'Book list').item('Own book').expectCount(1);
    await ui.collection(page, 'Book list').item('Own book').open();
    assert.equal(await page.evaluate(() => window.cardOpened), true);
  });
  await check('separate open action is bound to its named list row', async () => {
    await page.setContent('<ul aria-label="Books"><li><h3>Own book</h3><button onclick="window.rowOpened=\'own\'">Open</button></li><li><h3>Other book</h3><button onclick="window.rowOpened=\'other\'">Open</button></li></ul>');
    await ui.collection(page, 'Book list').item('Own book').open();
    assert.equal(await page.evaluate(() => window.rowOpened), 'own');
  });
  await check('duplicate object openings, static names and wrong owner remain failures', async () => {
    await page.setContent('<section aria-label="Books"><button>Own book</button><button>Open Own book</button></section>');
    await assert.rejects(() => ui.collection(page, 'Book list').item('Own book').open());
    await page.setContent('<section aria-label="Books"><p>Own book</p><button>Delete Own book</button></section>');
    await assert.rejects(() => ui.collection(page, 'Book list').item('Own book').open());
    await page.setContent('<section aria-label="Books"><button>Delete <span>Own book</span></button><button>Edit <span>Own book</span></button></section>');
    await assert.rejects(() => ui.collection(page, 'Book list').item('Own book').open());
    await page.setContent('<section><h1>Own book</h1><p>Own page</p></section><aside><button>Open Own page</button></aside>');
    await assert.rejects(() => ui.collection(page, 'Page list', { owner: 'Own book' }).item('Own page').open());
  });
  await check('unlabelled shelf books are owned by the selected shelf', async () => {
    await page.setContent('<main><div><h1>Own shelf</h1><ul><li><button onclick="window.shelfBookOpened=true">Open Own book</button></li></ul></div><aside aria-label="Book list"><button>Other book</button></aside></main>');
    const books = ui.collection(page, 'Book list', { owner: 'Own shelf' });
    await books.item('Other book').expectAbsent();
    await books.item('Own book').open();
    assert.equal(await page.evaluate(() => window.shelfBookOpened), true);
  });
  await check('a named collection outside the owner cannot satisfy its missing item', async () => {
    await page.setContent('<section><h1>Own book</h1><p>Own page</p></section><aside aria-label="Page list"><button>Own page</button></aside>');
    await assert.rejects(() => ui.collection(page, 'Page list', { owner: 'Own book' }).item('Own page').open());
  });
  await check('a breadcrumb cannot become the collection during navigation', async () => {
    await page.setContent('<main><div><nav><a href="#">Books</a></nav><h1>Previous book</h1></div></main>');
    await page.evaluate(() => setTimeout(() => {
      document.querySelector('main').innerHTML = '<h1>Books</h1><section aria-label="Book list"><button onclick="window.delayedBookOpened=true">Own book</button></section>';
    }, 80));
    await ui.collection(page, 'Book list').item('Own book').open();
    assert.equal(await page.evaluate(() => window.delayedBookOpened), true);
  });
  await check('collection items re-resolve a provisional container after data loading', async () => {
    await page.setContent('<div id="stage"><h1>Books</h1><p>Loading</p></div>');
    await page.evaluate(() => setTimeout(() => {
      document.querySelector('#stage').innerHTML = '<h1>Books</h1><div><h2>Other section</h2><section aria-label="Book list"><button onclick="window.loadedBook=true">Own book</button></section></div>';
    }, 80));
    await ui.collection(page, 'Book list').item('Own book').open();
    assert.equal(await page.evaluate(() => window.loadedBook), true);
  });
  await check('metadata assertions reject lost name description tags and unexpected tag values', async () => {
    const helpers = loadHelpers();
    for (const [name, description, tags] of [['Wrong name', 'Own description', 'alpha,beta'], ['Own book', 'Wrong description', 'alpha,beta'], ['Own book', 'Own description', 'alpha']]) {
      await page.setContent(`<input aria-label="Name" value="${name}"><textarea aria-label="Description">${description}</textarea><input aria-label="Tags" value="${tags}">`);
      await assert.rejects(() => helpers.expectMetadata(page, 'Own book', 'Own description', 'alpha,beta'));
    }
    await page.setContent('<input aria-label="Name" value="Own book"><textarea aria-label="Description">Own description</textarea><input aria-label="Tag Name" value="alpha"><input aria-label="Tag Value" value="unexpected">');
    await assert.rejects(() => helpers.expectMetadata(page, 'Own book', 'Own description', 'alpha'));
  });
  await check('login succeeds without depending on any dashboard collection', async () => {
    await page.setContent('<header><button>Shelves</button><button>Books</button><button id="login">Login</button></header><main></main>');
    await page.evaluate(() => {
      document.querySelector('#login').onclick = () => {
        document.querySelector('main').innerHTML = '<form><label>Email<input></label><label>Password<input type="password"></label><button id="submit">Login</button></form>';
        document.querySelector('#submit').onclick = (event) => {
          event.preventDefault();
          document.querySelector('header').innerHTML = '<button>Shelves</button><button>Books</button><span>Admin</span>';
          document.querySelector('main').innerHTML = '<h1>Home</h1>';
        };
      };
    });
    await loadHelpers().login(page);
    await page.setContent('<header><button>Login</button></header><main><p>Admin</p></main>');
    await assert.rejects(() => ui.accountIdentity(page, 'Admin').expectVisible());
  });
  await check('detail content must belong to the selected object, not a sidebar or editor', async () => {
    await page.setContent('<article><h1>Own page</h1><p>Own body</p></article><aside><p>Own body</p></aside>');
    await ui.detailContent(page, 'Own page', 'Own body').expectVisible();
    for (const markup of [
      '<article><h1>Own page</h1><p>Wrong body</p></article><aside><p>Own body</p></aside>',
      '<section><h1>Own page</h1><div contenteditable="true"><span>Own body</span></div></section>',
      '<article><h1>Other page</h1><p>Own body</p></article><article><h1>Own page</h1></article>',
    ]) {
      await page.setContent(markup);
      await assert.rejects(() => ui.detailContent(page, 'Own page', 'Own body').expectVisible());
    }
  });
  await check('collection capacity counts actual records and rejects one above every limit', async () => {
    for (const [name, limit] of [['My Recently Viewed', 10], ['My Most Viewed Favorites', 4], ['Recently Updated Pages', 5]]) {
      const rows = count => Array.from({ length: count }, (_, i) => `<li><a href="#${i}">Item ${i}</a></li>`).join('');
      await page.setContent(`<section aria-label="${name}"><a href="#all">View All</a><ul>${rows(limit)}</ul></section>`);
      await ui.collection(page, name).expectMaxItems(limit);
      await page.setContent(`<section aria-label="${name}"><a href="#all">View All</a><ul>${rows(limit + 1)}</ul></section>`);
      await assert.rejects(() => ui.collection(page, name).expectMaxItems(limit));
    }
    await page.setContent('<section aria-label="My Recently Viewed"><p>Unrecognizable records</p></section>');
    await assert.rejects(() => ui.collection(page, 'My Recently Viewed').expectMaxItems(10));
  });
  await check('chapterName is rejected before any UI preparation', async () => {
    await assert.rejects(() => loadHelpers().createPage({}, { title: 'Own page', content: 'Own body', bookName: 'Own book', chapterName: 'Own chapter' }), /does not support chapterName/);
  });
  await check('favorite cleanup restores only tracked books and retains the original test failure', async () => {
    await page.setContent('<header><button>Shelves</button><button id="books">Books</button></header><main></main>');
    await page.evaluate(() => {
      window.qualityFavorites = { Own: true, Historical: true };
      document.querySelector('#books').onclick = () => {
        document.querySelector('main').innerHTML = '<section aria-label="Book list"><button id="own">Own</button><button>Historical</button></section>';
        document.querySelector('#own').onclick = () => {
          document.querySelector('main').innerHTML = '<h1>Own</h1><button id="favorite">Unfavorite</button>';
          document.querySelector('#favorite').onclick = () => {
            window.qualityFavorites.Own = false;
            document.querySelector('#favorite').textContent = 'Favorite';
          };
        };
      };
    });
    const primary = new Error('Original assertion failure');
    await assert.rejects(() => loadHelpers().withFavoriteCleanup(page, async track => { track('Own'); throw primary; }), error => error === primary);
    assert.deepEqual(await page.evaluate(() => window.qualityFavorites), { Own: false, Historical: true });
  });
  for (const alternate of [false, true]) await check(`real page preparation with ${alternate ? 'purpose labels and wrapped book name' : 'legacy labels'}`, async () => {
    await page.setContent('<header><button>Shelves</button><button id="books">Books</button></header><main></main>');
    await page.evaluate((alternate) => {
      const main = document.querySelector('main');
      const book = () => {
        main.innerHTML = '<section><h1>Own book</h1><button id="new">New Page</button><div id="pages"></div></section>';
        if (window.savedTitle) {
          const item = document.createElement('a'); item.href = '#page'; item.textContent = window.savedTitle;
          main.querySelector('#pages').append(item);
        }
        main.querySelector('#new').onclick = () => {
          main.innerHTML = alternate
            ? '<label>Title<input id="title"></label><div contenteditable="true" aria-label="Body"></div><button id="save">Save Page</button>'
            : '<label>Page title<input id="title"></label><div contenteditable="true" aria-label="Write your page content here..."></div><button id="save">Save Page</button>';
          main.querySelector('#save').onclick = () => {
            window.savedTitle = main.querySelector('input').value;
            window.savedBody = main.querySelector('[contenteditable]').innerText;
            book();
          };
        };
      };
      document.querySelector('#books').onclick = () => {
        main.innerHTML = alternate
          ? '<section aria-label="Books"><button id="own">Open Own book</button></section>'
          : '<section aria-label="Book list"><button id="own">Own book</button></section>';
        main.querySelector('#own').onclick = book;
      };
    }, alternate);
    const name = await loadHelpers().createPage(page, { bookName: 'Own book', title: 'Own page', content: 'Own body' });
    assert.equal(name, 'Own page');
    assert.equal(await page.evaluate(() => window.savedBody), 'Own body');
  });
} finally {
  await browser.close();
}
const result = {
  schema_version: 1, method: 'Chromium synthetic DOM checks, not a generated application run',
  summary: { passed: checks.length, failed: 0 }, checks,
  limits: 'Does not guarantee compatibility with arbitrary unlabelled layouts or all custom widget state formats.',
};
const reportDirectory = resolve(root, 'ref/bookstack');
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(resolve(reportDirectory, 'role_compatibility_checks.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result.summary));
