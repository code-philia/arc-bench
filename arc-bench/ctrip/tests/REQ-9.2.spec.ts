// requirement: REQ-9.2
import { test, button, region, visible, textVisible, openHome, openAirport, action, popularAirport, expectDomesticAirportCity } from "./helpers";
import { preferredVisible } from './ui';

test('REQ-9.2: Read popular airport links', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  for (const name of ['Beijing Capital Airport', 'Shanghai Pudong Airport', 'Guangzhou Baiyun Airport'] as const) {
    await visible(await popularAirport(page, name));
  }
});

test('REQ-9.2: Browse domestic cities by initial', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  await button(region(page, 'Domestic airports'), 'C').click();
  for (const city of ['Chengdu', 'Chongqing', 'Changchun'] as const) await expectDomesticAirportCity(page, city);
});

test('REQ-9.2: Read city weather snapshot', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  await textVisible(region(page, 'Today weather'), /^(?:Beijing|北京)$/i);
  await textVisible(region(page, 'Today weather'), /^-5\s*°C\s*(?:to|[~～–—-])\s*3\s*°C$/i);
  const boarding = /^(?:Boarding (?:process|procedures?)|乘机流程(?:\s+Boarding (?:process|procedures?))?)$/i;
  await preferredVisible(action(region(page, 'Today weather'), 'Boarding process'), action(page, boarding));
});
