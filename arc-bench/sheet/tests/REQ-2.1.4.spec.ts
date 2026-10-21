import { baseUrl } from './support/e2e';
import { expect, Page, test } from '@playwright/test';
import {
  addWorksheet,
  createBlankWorkbook,
  expectActiveWorksheet,
  gridCell,
  openDataMenu,
  openWorksheetOptions,
  selectCellRange,
  setClipboardText,
  worksheetTab,
} from './support/e2e';

async function chooseDelete(page: Page, worksheetName: string): Promise<void> {
  await openWorksheetOptions(page, worksheetName);
  await page.getByRole('menuitem', { name: /^(delete)$/i }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.1.4: Delete a Worksheet - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await addWorksheet(page, 'Sheet2');

  await chooseDelete(page, 'Sheet2');
  const dialog = page.getByRole('dialog', { name: /^(delete worksheet)$/i });
  await expect(dialog).toContainText('Sheet2');
  await dialog.getByRole('button', { name: /^(delete worksheet)$/i }).click();

  await expect(worksheetTab(page, 'Sheet2')).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet1');
  await page.reload();
  await expect(worksheetTab(page, 'Sheet2')).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet1');
});

test('REQ-2.1.4: Delete a Worksheet - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);

  await chooseDelete(page, 'Sheet1');
  await expect(page.getByText(/a workbook must contain at least one worksheet/)).toBeVisible();
  await expect(page.getByRole('dialog', { name: /^(delete worksheet)$/i })).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet1');

  await page.reload();
  await expectActiveWorksheet(page, 'Sheet1');
});

test('REQ-2.1.4: Delete a Worksheet - Scenario 3', async ({ page }) => {
  const sourceWorksheet = 'Sheet1';
  const sourceCell = 'A2';
  const sourceValue = 'East';
  const resultWorksheet = 'Pivot1';
  const resultCell = 'B2';
  const resultValue = '100';
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tSales\nEast\t100\nNorth\t200');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await selectCellRange(page, 'A1', 'B3');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create pivot table)$/i }).click();
  const createDialog = page.getByRole('dialog', { name: /^(create pivot table)$/i });
  await expect(createDialog).toContainText(/Source range:\s*A1:B3/i);
  await createDialog.getByRole('radio', { name: /^(new worksheet)$/i }).check();
  await createDialog.getByRole('button', { name: /^(create)$/i }).click();
  const editor = page.getByRole('region', { name: /^(pivot table editor)$/i });
  await editor.getByLabel(/^(rows)$/i).click();
  await page.getByRole('option', { name: /^Region$/i }).click();
  await editor.getByLabel(/^(values)$/i).click();
  await page.getByRole('option', { name: /^Sales$/i }).click();
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await worksheetTab(page, sourceWorksheet).click();
  await expectActiveWorksheet(page, sourceWorksheet);
  await expect(gridCell(page, sourceCell)).toHaveText(sourceValue);

  await chooseDelete(page, sourceWorksheet);
  const dialog = page.getByRole('dialog', { name: /^(delete worksheet)$/i });
  await dialog.getByRole('button', { name: /^(delete worksheet)$/i }).click();
  await expect(page.getByText(/delete or rebuild dependent pivot tables first/i)).toBeVisible();
  await expect(dialog).toHaveCount(0);

  await expectActiveWorksheet(page, sourceWorksheet);
  await expect(gridCell(page, sourceCell)).toHaveText(sourceValue);
  await worksheetTab(page, resultWorksheet).click();
  await expectActiveWorksheet(page, resultWorksheet);
  await expect(gridCell(page, resultCell)).toHaveText(resultValue);

  await page.reload();
  await expect(worksheetTab(page, sourceWorksheet)).toBeVisible();
  await expectActiveWorksheet(page, resultWorksheet);
  await expect(gridCell(page, resultCell)).toHaveText(resultValue);
  await worksheetTab(page, sourceWorksheet).click();
  await expectActiveWorksheet(page, sourceWorksheet);
  await expect(gridCell(page, sourceCell)).toHaveText(sourceValue);
});

test('REQ-2.1.4: Delete a Worksheet - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tSales\nEast\t100\nNorth\t200');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await addWorksheet(page, 'Sheet2');
  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');

  await selectCellRange(page, 'A1', 'B3');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create pivot table)$/i }).click();
  const createDialog = page.getByRole('dialog', { name: /^(create pivot table)$/i });
  await createDialog.getByRole('radio', { name: /^(new worksheet)$/i }).check();
  await createDialog.getByRole('button', { name: /^(create)$/i }).click();
  const editor = page.getByRole('region', { name: /^(pivot table editor)$/i });
  await editor.getByLabel(/^(rows)$/i).click();
  await page.getByRole('option', { name: /^Region$/i }).click();
  await editor.getByLabel(/^(values)$/i).click();
  await page.getByRole('option', { name: /^Sales$/i }).click();
  await editor.getByLabel(/^(summarize by)$/i).click();
  await page.getByRole('option', { name: /^SUM$/i }).click();
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('100');
  await expect(gridCell(page, 'B3')).toHaveText('200');

  await chooseDelete(page, 'Pivot1');
  const pivotDialog = page.getByRole('dialog', { name: /^(delete worksheet)$/i });
  await pivotDialog.getByRole('button', { name: /^(delete worksheet)$/i }).click();
  await expect(worksheetTab(page, 'Pivot1')).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet2');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('100');
  await chooseDelete(page, 'Sheet1');
  const sourceDialog = page.getByRole('dialog', { name: /^(delete worksheet)$/i });
  await sourceDialog.getByRole('button', { name: /^(delete worksheet)$/i }).click();
  await expect(worksheetTab(page, 'Sheet1')).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet2');

  await page.reload();
  await expect(worksheetTab(page, 'Pivot1')).toHaveCount(0);
  await expect(worksheetTab(page, 'Sheet1')).toHaveCount(0);
  await expectActiveWorksheet(page, 'Sheet2');
});
