// requirement: REQ-9.2
import { test, button, region, visible, textVisible, openHome, openAirport, action } from "./helpers";

test('REQ-9.2: Read popular airport links', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  for (const name of ['Beijing Capital Airport', 'Shanghai Pudong Airport', 'Guangzhou Baiyun Airport']) await visible(action(region(page, 'Popular airports'), name));
});

test('REQ-9.2: Browse domestic cities by initial', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  await button(region(page, 'Domestic airports'), 'C').click();
  for (const name of ['Chengdu', 'Chongqing', 'Changchun']) await visible(action(region(page, 'Domestic airports'), name));
});

test('REQ-9.2: Read city weather snapshot', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  await textVisible(region(page, 'Today weather'), 'Beijing');
  await textVisible(region(page, 'Today weather'), '-5°C to 3°C');
  await visible(action(region(page, 'Today weather'), 'Boarding process'));
});
