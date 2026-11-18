import { test, expect } from '@playwright/test';
import {
  action, cartRow, emptyCartMessage, expectProductDetails, expectStockRejection,
  orderConfirmationHeading, savedAddressChoice, signedInNav, stockRejectionAlert, CART,
} from '../arc-bench/prestashop/tests/helpers';
import { sidebarAction, sidebarItemText } from '../arc-bench/keep/tests/helpers';

const utility = '<div><span>Store User</span><a href="/account">My account</a><button>Sign out</button><a href="/cart">Cart (0)</a></div>';

test('nested utility candidates still identify the one header control set', async ({ page }) => {
  await page.setContent(`<div>${utility}
    <div><a href="/">My Store</a><input aria-label="Search"></div>
    <section aria-label="Account overview"><h1>My account</h1><button>Sign out</button></section>
  </div>`);
  const header = await signedInNav(page);
  await expect(header).toHaveCount(1);
  await expect(header).toContainText('Store User');
  await expect(action(header, 'Sign out')).toHaveCount(1);
  await expect(action(header, 'My account')).toHaveAttribute('href', '/account');
  await expect(action(header, 'Cart')).toHaveAttribute('href', '/cart');
});

test('footer navigation is not proof of sign-in', async ({ page }) => {
  await page.setContent(`<footer><nav aria-label="Global navigation">${utility}</nav></footer>`);
  await expect(signedInNav(page)).rejects.toThrow();
});

test('disjoint utility groups and duplicate actions in a declared header stay ambiguous', async ({ page }) => {
  await page.setContent(`${utility}${utility}`);
  await expect(signedInNav(page)).rejects.toThrow();
  await page.setContent(`<header><nav aria-label="Global navigation">${utility}</nav><button>Sign out</button></header>`);
  await expect(signedInNav(page)).rejects.toThrow();
  await page.setContent(`<nav aria-label="Global navigation">${utility}</nav>${utility}`);
  await expect(signedInNav(page)).rejects.toThrow();
  await page.setContent('<div>' + utility + '<button>Sign out</button><div><a href="/">My Store</a><input aria-label="Search"></div></div>');
  await expect(signedInNav(page)).rejects.toThrow();
});

test('an account-body decoy does not replace the signed-out storefront header', async ({ page }) => {
  await page.setContent('<nav aria-label="Global navigation"><a href="/login">Sign in</a><a href="/cart">Cart (0)</a></nav>'
    + '<section aria-label="Account overview">' + utility + '</section>');
  await expect(signedInNav(page)).rejects.toThrow();
  await page.setContent('<div><a href="/">My Store</a><input aria-label="Search"><a href="/login">Sign in</a><a href="/cart">Cart (0)</a></div>'
    + '<section aria-label="Account overview">' + utility + '</section>');
  await expect(signedInNav(page)).rejects.toThrow();
});

test('an unmarked footer sign-in link does not override the real signed-in header', async ({ page }) => {
  await page.setContent('<div><div>' + utility + '<a href="/">My Store</a><input aria-label="Search"></div>'
    + '<div><h3>Your account</h3><a href="#">Sign in</a></div></div>');
  await expect(action(await signedInNav(page), 'Sign out')).toHaveCount(1);
});

const row = `<article><a href="/product">${CART}</a><label>Quantity <input type="number" value="1"></label></article>`;
test('uppercase shopping cart is scoped to its own rows and keeps duplicates', async ({ page }) => {
  await page.setContent(`<nav><ul><li>${CART}</li></ul></nav><div><h1>SHOPPING CART</h1>${row}</div>`);
  await expect(cartRow(page, CART)).toHaveCount(1);
  await expect(cartRow(page, CART).getByRole('spinbutton')).toHaveValue('1');
  await page.setContent(`<div><h1>SHOPPING CART</h1>${row}${row}</div>`);
  await expect(cartRow(page, CART)).toHaveCount(2);
  await page.setContent(`<h1>Product recommendations</h1>${row}`);
  await expect(cartRow(page, CART)).toHaveCount(0);
  await page.setContent(`<main><h1>Shopping cart</h1><section aria-label="Shopping cart"><p>Your cart is empty.</p></section>${row}</main>`);
  await expect(cartRow(page, CART)).toHaveCount(1);
  await page.setContent('<h1>Shopping cart</h1><section aria-label="Shopping cart"><p>Your cart is empty.</p></section>'
    + '<ul aria-label="Cart items"><li><a href="/product">' + CART + '</a><label>Quantity <input value="1"></label></li></ul>');
  await expect(cartRow(page, CART)).toHaveCount(1);
});

test('only the empty-cart message in the cart content is accepted', async ({ page }) => {
  const message = '<p>There are no more items in your cart</p>';
  await page.setContent(`<div><h1>SHOPPING CART</h1>${message}</div><footer>${message}</footer>`);
  await expect(emptyCartMessage(page)).toHaveCount(1);
  await page.setContent(`<div><h1>Shopping cart</h1>${row}</div><footer>${message}</footer>`);
  await expect(emptyCartMessage(page)).toHaveCount(0);
  await page.setContent('<main><header><h1>Shopping cart</h1></header><p>There are no more items in your cart. Your shopping cart is empty.</p></main>');
  await expect(emptyCartMessage(page)).toHaveCount(1);
});

test('an actionable stock limit is valid, a non-alert or incorrect limit is not', async ({ page }) => {
  await page.setContent('<p role="alert">You cannot add 63 units. Only 50 of M/White are available in stock.</p>');
  await expectStockRejection(page, 63, 'M/White');
  await page.setContent('<p role="alert">Only 63 of M/White are available in stock.</p>');
  await expect(expectStockRejection(page, 63, 'M/White')).rejects.toThrow();
  await page.setContent('<p role="alert">Only 2 of L/Black are available in stock.</p>');
  await expect(expectStockRejection(page, 63, 'M/White')).rejects.toThrow();
  await expect(stockRejectionAlert(page)).toHaveCount(1);
  await page.setContent('<p>Only 50 of M/White are available in stock.</p>');
  await expect(expectStockRejection(page, 63, 'M/White')).rejects.toThrow();
});

test('cotton in a rendered detail node does not join neighboring labels', async ({ page }) => {
  const detail = (composition: string) => `<section aria-label="Product Details"><p>Reference HB-DETAIL</p><h3>Data sheet</h3>${composition}<h3>Features</h3><p>Regular-fit</p></section>`;
  await page.setContent(detail('<p>Composition: Cotton</p>'));
  await expectProductDetails(page);
  await page.setContent(detail('<p>Polyester</p><p hidden>Cotton</p>') + '<aside>Cotton</aside>');
  await expect(expectProductDetails(page)).rejects.toThrow();
  await page.setContent(detail('<p>Composition: Polyester</p><p>Not available in Cotton</p>'));
  await expect(expectProductDetails(page)).rejects.toThrow();
  await page.setContent(detail('<p>Composition: Polyester</p>').replace('<p>Regular-fit</p>', '<p>Regular-fit</p><p>Cotton</p>'));
  await expect(expectProductDetails(page)).rejects.toThrow();
});

test('confirmation recognizes the reference heading without accepting informational copy', async ({ page }) => {
  await page.setContent('<nav>Order confirmation</nav><main><h1>Your order is confirmed</h1></main>');
  await expect(orderConfirmationHeading(page)).toHaveCount(1);
  await page.setContent('<main><h1>Order confirmation instructions</h1><p>Your order is confirmed</p></main>');
  await expect(orderConfirmationHeading(page)).toHaveCount(0);
});

test('archive text must appear in the correct sidebar action, not elsewhere', async ({ page }) => {
  const sidebar = page.getByRole('navigation', { name: 'Sidebar' });
  await page.setContent('<nav aria-label="Sidebar"><button>Archive</button><p>Archive</p></nav>');
  await expect(await sidebarItemText(sidebar, 'Archived')).toHaveCount(1);
  await page.setContent('<nav aria-label="Sidebar"><button aria-label="Archive"><span hidden>Archive</span></button><p>Archive</p></nav>');
  await expect(sidebarAction(sidebar, 'Archived')).toBeVisible();
  await expect(await sidebarItemText(sidebar, 'Archived')).toHaveCount(0);
  await page.setContent('<nav aria-label="Sidebar"><button aria-labelledby="archive-label"></button><span id="archive-label">Archived</span></nav>');
  await expect(await sidebarItemText(sidebar, 'Archived')).toHaveCount(1);
});

test('shipping selects the exact address alias even when its label includes the street', async ({ page }) => {
  await page.setContent('<section aria-label="Addresses"><label><input type="radio"><span>Residence 12</span> 3 Harbor Road</label>'
    + '<label><input type="radio"><span>Residence 1</span> 2 Harbor Road</label></section>'
    + '<fieldset><label><input type="radio"><span>Residence 1</span> 99 Harbor Road</label></fieldset>');
  const addresses = page.getByRole('region', { name: 'Addresses', exact: true });
  await expect(savedAddressChoice(addresses, 'Residence 1')).toHaveCount(1);
  await expect(savedAddressChoice(addresses, 'Residence 1')).toHaveAccessibleName('Residence 1 2 Harbor Road');
  await expect(savedAddressChoice(addresses, 'Residence')).toHaveCount(0);
});
