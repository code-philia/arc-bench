import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  addWorksheet,
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectActiveWorksheet,
  expectSelectedCell,
  gridCell,
  openWorksheetOptions,
  worksheetTab,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.1.1: Add a Worksheet - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Existing data');
  await page.getByRole('gridcell', { name: 'A1', exact: true }).click();
  await page.getByLabel(/^(formula bar)$/i).fill('Existing data');
  await page.getByLabel(/^(formula bar)$/i).press('Enter');
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('Existing data');

  await addWorksheet(page, 'Sheet2');
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(worksheetTab(page, 'Sheet1')).toBeVisible();

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('Existing data');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await page.reload();
  await expectActiveWorksheet(page, 'Sheet2');
  await expectSelectedCell(page, 'A1');
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(worksheetTab(page, 'Sheet1')).toBeVisible();
});

test('REQ-2.1.1: Add a Worksheet - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await addWorksheet(page, 'Sheet2');

  await openWorksheetOptions(page, 'Sheet2');
  await page.getByRole('menuitem', { name: /^(rename)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(rename worksheet)$/i });
  await dialog.getByLabel(/^(worksheet name)$/i).fill('Sheet3');
  await dialog.getByRole('button', { name: /^(save)$/i }).click();
  await expectActiveWorksheet(page, 'Sheet3');

  await addWorksheet(page, 'Sheet2');
  await expect(worksheetTab(page, 'Sheet1')).toBeVisible();
  await expect(worksheetTab(page, 'Sheet3')).toBeVisible();
  await page.reload();
  await expectActiveWorksheet(page, 'Sheet2');
  await expect(worksheetTab(page, 'Sheet1')).toBeVisible();
  await expect(worksheetTab(page, 'Sheet3')).toBeVisible();
});
