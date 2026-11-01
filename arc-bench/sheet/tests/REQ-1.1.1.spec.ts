import { baseUrl } from './support/e2e';
import { Browser, expect, Page, test } from '@playwright/test';
import {
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectActiveWorksheet,
  gridCell,
  openWorkbookHome,
  openVisibleWorkbook,
  uniqueName,
} from './support/e2e';

async function renameWorkbook(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name: /^(rename workbook)$/i }).click();
  await page.getByLabel(/^(workbook name)$/i).fill(name);
  await page.getByRole('button', { name: /^(save)$/i }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
}

async function expectWorkbookInNewSession(
  browser: Browser,
  workbookName: string,
  cellValue: string,
  lastUpdatedText: string,
): Promise<void> {
  const context = await browser.newContext();
  try {
    const reopenedPage = await context.newPage();
    await openVisibleWorkbook(reopenedPage, workbookName);
    await expect(reopenedPage.getByText(workbookName, { exact: true })).toBeVisible();
    await expect(reopenedPage.getByText(lastUpdatedText, { exact: true })).toBeVisible();
    await expect(gridCell(reopenedPage, 'A1')).toHaveText(cellValue);
  } finally {
    await context.close();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-1.1.1: View and Open a Workbook - Scenario 1', async ({ page, browser }) => {
  const workbookName = uniqueName('pw-open-workbook');
  const updatedText = uniqueName('pw-open-value');
  await createBlankWorkbook(page);
  await renameWorkbook(page, workbookName);
  await commitCellThroughFormulaBar(page, 'A1', updatedText);
  await openWorkbookHome(page);
  const activeWorksheet = 'Sheet1';
  const activeWorksheetValue = updatedText;
  const workbookLink = page.getByRole('link', { name: workbookName, exact: true });
  await expect(workbookLink).toBeVisible();
  const lastUpdatedText = await workbookLink.getByText(/^Last updated: /).innerText();

  await workbookLink.click();
  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expect(page.getByText(lastUpdatedText, { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText(updatedText);
  await expect(page.getByText(updatedText, { exact: true })).toBeVisible();
  await expectActiveWorksheet(page, activeWorksheet);
  await expect(page.getByText(activeWorksheetValue, { exact: true })).toBeVisible();

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText(updatedText);

  await page.reload();
  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expect(page.getByText(updatedText, { exact: true })).toBeVisible();
  await expectActiveWorksheet(page, activeWorksheet);
  await expect(page.getByText(activeWorksheetValue, { exact: true })).toBeVisible();

  await expectWorkbookInNewSession(browser, workbookName, updatedText, lastUpdatedText);
});

test('REQ-1.1.1: View and Open a Workbook - Scenario 2', async ({ page }) => {
  const firstName = uniqueName('pw-first-workbook');
  const secondName = uniqueName('pw-second-workbook');
  const firstValue = uniqueName('pw-first-value');
  const secondValue = uniqueName('pw-second-value');

  await createBlankWorkbook(page);
  await renameWorkbook(page, firstName);
  await commitCellThroughFormulaBar(page, 'A1', firstValue);

  await createBlankWorkbook(page);
  await renameWorkbook(page, secondName);
  await commitCellThroughFormulaBar(page, 'A1', secondValue);

  await openWorkbookHome(page);
  await expect(page.getByRole('link', { name: firstName, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: secondName, exact: true })).toBeVisible();
  await page.getByRole('link', { name: firstName, exact: true }).click();
  await expect(gridCell(page, 'A1')).toHaveText(firstValue);
  await expect(page.getByText(secondValue, { exact: true })).toHaveCount(0);

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText(firstValue);
  await expect(page.getByText(secondValue, { exact: true })).toHaveCount(0);
});
