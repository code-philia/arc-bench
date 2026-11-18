// requirement: REQ-9.3
import { expect } from "@playwright/test";
import { test, region, tab, record, textVisible, textToken, openHome, openAirportDetails, selectedTab } from "./helpers";

test('REQ-9.3: Read default airport overview', async ({ page }) => {
  await openHome(page);
  await openAirportDetails(page);
  await expect(selectedTab(page, 'Overview')).toBeVisible();
  await tab(page, 'Overview').click();
  for (const value of ['Beijing', '3 runways', "China's first national gateway"]) await textVisible(region(page, 'Airport overview'), textToken(value));
});

test('REQ-9.3: Read airport bus timetable', async ({ page }) => {
  await openHome(page);
  await openAirportDetails(page);
  await tab(page, 'Transportation').click();
  const timetable = record(region(page, 'City buses'), 'Fangzhuang line');
  for (const value of [
    /^(?:Stop\s*[:：]\s*)?Fangzhuang$/i,
    /^(?:First service\s*[:：]\s*)?06:00$/i,
    /^(?:Last service\s*[:：]\s*)?21:00$/i,
    /^(?:Headway\s*[:：]\s*)?30\s*(?:minutes?|min)$/i,
  ]) await textVisible(timetable, value);
});

test('REQ-9.3: Read airport medical hotline', async ({ page }) => {
  await openHome(page);
  await openAirportDetails(page);
  await tab(page, 'Phone numbers').click();
  const phone = record(page, 'Medical first aid center').or(
    page.locator('p').filter({ has: page.getByText('Medical first aid center', { exact: true }) }),
  );
  await textVisible(phone, '010-64541100');
});
