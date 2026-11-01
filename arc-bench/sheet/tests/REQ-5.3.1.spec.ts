import { baseUrl } from './support/e2e';
import { expect, Locator, Page, test } from '@playwright/test';
import {
  columnHeader,
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectActiveWorksheet,
  gridCell,
  openDataMenu,
  rowHeader,
  selectCellRange,
  setClipboardText,
  worksheetTab,
} from './support/e2e';

async function chooseEditorOption(
  page: Page,
  editor: Locator,
  label: RegExp,
  option: RegExp,
): Promise<void> {
  await editor.getByLabel(label).click();
  await page.getByRole('option', { name: option }).click();
}

async function createPivotEditor(page: Page, start: string, end: string): Promise<Locator> {
  await selectCellRange(page, start, end);
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create pivot table)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(create pivot table)$/i });
  await dialog.getByRole('radio', { name: /^(new worksheet)$/i }).check();
  await dialog.getByRole('button', { name: /^(create)$/i }).click();
  await expectActiveWorksheet(page, 'Pivot1');
  return page.getByRole('region', { name: /^(pivot table editor)$/i });
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tSales\nEast\t1200\nNorth\t800\nEast\t600\nSouth\t1000\nNorth\t700');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expectActiveWorksheet(page, 'Sheet1');
  const sourceRows = [
    { row: 2, region: 'East', sales: '1200' },
    { row: 3, region: 'North', sales: '800' },
    { row: 4, region: 'East', sales: '600' },
    { row: 5, region: 'South', sales: '1000' },
    { row: 6, region: 'North', sales: '700' },
  ];
  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('Sales');
  for (const source of sourceRows) {
    await expect(gridCell(page, `A${source.row}`)).toHaveText(source.region);
    await expect(gridCell(page, `B${source.row}`)).toHaveText(source.sales);
  }

  await selectCellRange(page, 'A1', 'B6');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create pivot table)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(create pivot table)$/i });
  await expect(dialog).toContainText('A1:B6');
  await dialog.getByRole('radio', { name: /^(new worksheet)$/i }).check();
  await dialog.getByRole('button', { name: /^(create)$/i }).click();

  await expectActiveWorksheet(page, 'Pivot1');
  const editor = page.getByRole('region', { name: /^(pivot table editor)$/i });
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^SUM$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('SUM of Sales');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('1800');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('1500');
  await expect(gridCell(page, 'A4')).toHaveText('South');
  await expect(gridCell(page, 'B4')).toHaveText('1000');
  await expect(gridCell(page, 'A5')).toHaveText('Grand Total');
  await expect(gridCell(page, 'B5')).toHaveText('4300');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  for (const source of sourceRows) {
    await expect(gridCell(page, `A${source.row}`)).toHaveText(source.region);
    await expect(gridCell(page, `B${source.row}`)).toHaveText(source.sales);
  }

  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.reload();
  await expectActiveWorksheet(page, 'Pivot1');
  await expect(gridCell(page, 'B2')).toHaveText('1800');
  await expect(gridCell(page, 'B3')).toHaveText('1500');
  await expect(gridCell(page, 'B4')).toHaveText('1000');
  await expect(gridCell(page, 'B5')).toHaveText('4300');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tSales\nEast\t1200\nNorth\t800\nEast\t600');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('600');
  const editor = await createPivotEditor(page, 'A1', 'B4');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await commitCellThroughFormulaBar(page, 'B2', '1500');
  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('1800');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('800');
  await expect(gridCell(page, 'A4')).toHaveText('Grand Total');
  await expect(gridCell(page, 'B4')).toHaveText('2600');

  await page.getByRole('button', { name: /^(refresh pivot table)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('2100');
  await expect(gridCell(page, 'B3')).toHaveText('800');
  await expect(gridCell(page, 'B4')).toHaveText('2900');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('Sales');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('1500');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('800');
  await expect(gridCell(page, 'A4')).toHaveText('East');
  await expect(gridCell(page, 'B4')).toHaveText('600');

  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.reload();
  await expectActiveWorksheet(page, 'Pivot1');
  await expect(gridCell(page, 'B2')).toHaveText('2100');
  await expect(gridCell(page, 'B3')).toHaveText('800');
  await expect(gridCell(page, 'B4')).toHaveText('2900');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tQuarter\tSales',
    'East\tQ1\t100',
    'East\tQ1\t200',
    'East\tQ2\t150',
    'North\tQ1\t300',
    'North\tQ2\t',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A6')).toHaveText('North');

  const editor = await createPivotEditor(page, 'A1', 'C6');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(columns)$/i, /^Quarter$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^COUNT$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('Q1');
  await expect(gridCell(page, 'C1')).toHaveText('Q2');
  await expect(gridCell(page, 'D1')).toHaveText('Grand Total');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'C2')).toHaveText('1');
  await expect(gridCell(page, 'D2')).toHaveText('3');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('1');
  await expect(gridCell(page, 'C3')).toHaveText('0');
  await expect(gridCell(page, 'D3')).toHaveText('1');
  await expect(gridCell(page, 'A4')).toHaveText('Grand Total');
  await expect(gridCell(page, 'D4')).toHaveText('4');

  await page.reload();
  await expectActiveWorksheet(page, 'Pivot1');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'C2')).toHaveText('1');
  await expect(gridCell(page, 'D4')).toHaveText('4');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tSales',
    'East\t100',
    'East\tnot numeric',
    'East\t300',
    'North\t200',
    'North\t',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B5')).toHaveText('200');

  const editor = await createPivotEditor(page, 'A1', 'B6');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^AVERAGE$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('AVERAGE of Sales');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('200');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'A4')).toHaveText('Grand Total');
  await expect(gridCell(page, 'B4')).toHaveText('200');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'B2')).toHaveText('100');
  await expect(gridCell(page, 'B3')).toHaveText('not numeric');
  await expect(gridCell(page, 'B4')).toHaveText('300');
  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('200');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('200');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tStatus',
    'East\tOpen',
    'East\tClosed',
    'North\tOpen',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('Open');

  const editor = await createPivotEditor(page, 'A1', 'B4');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Status$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^COUNT$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'A2')).toHaveText('Open');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'A3')).toHaveText('Closed');
  await expect(gridCell(page, 'B3')).toHaveText('1');
  await expect(gridCell(page, 'B4')).toHaveText('3');

  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^SUM$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(page.getByText(
    /^(value field requires numeric values)$/i,
  )).toBeVisible();
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'B3')).toHaveText('1');
  await expect(gridCell(page, 'B4')).toHaveText('3');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'B2')).toHaveText('Open');
  await expect(gridCell(page, 'B3')).toHaveText('Closed');
  await expect(gridCell(page, 'B4')).toHaveText('Open');
  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Open');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'A3')).toHaveText('Closed');
  await expect(gridCell(page, 'B3')).toHaveText('1');
  await expect(gridCell(page, 'B4')).toHaveText('3');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 6', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tSales',
    'East\t100',
    'North\t200',
    'East\t300',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('300');

  await selectCellRange(page, 'A1', 'B4');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create filter)$/i }).click();
  await page
    .getByRole('grid', { name: /^(worksheet grid)$/i })
    .getByRole('button', { name: /^(filter Region)$/i })
    .click();
  const filterDialog = page.getByRole('dialog', { name: /^(filter Region)$/i });
  await filterDialog.getByRole('button', { name: /^(clear selection)$/i }).click();
  await filterDialog.getByRole('checkbox', { name: /^East$/i }).check();
  await filterDialog.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(filterDialog).toBeHidden();
  const filterRangeDialog = page.getByRole('dialog', {
    name: /^(filter selected range)$/i,
  });
  await filterRangeDialog.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(filterRangeDialog).toBeHidden();
  await expect(gridCell(page, 'A3')).not.toBeVisible();

  const editor = await createPivotEditor(page, 'A1', 'B4');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^SUM$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');

  await page.getByRole('button', { name: /^(refresh pivot table)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');
  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 7', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tSales',
    'East\t100',
    'North\t200',
    'East\t300',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('300');

  const editor = await createPivotEditor(page, 'A1', 'B4');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^SUM$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await rowHeader(page, 3).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row below)$/i }).click();
  await expect(gridCell(page, 'A4')).toHaveText('');
  await expect(gridCell(page, 'A5')).toHaveText('East');
  await commitCellThroughFormulaBar(page, 'A4', 'East');
  await commitCellThroughFormulaBar(page, 'B4', '50');
  await expect(gridCell(page, 'A5')).toHaveText('East');
  await expect(gridCell(page, 'B5')).toHaveText('300');

  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.getByRole('button', { name: /^(refresh pivot table)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('450');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('650');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await columnHeader(page, 'B').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column left)$/i }).click();
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Sales');
  await expect(gridCell(page, 'C4')).toHaveText('50');

  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.getByRole('button', { name: /^(refresh pivot table)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('450');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('650');

  await page.reload();
  await expectActiveWorksheet(page, 'Pivot1');
  await expect(gridCell(page, 'B2')).toHaveText('450');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('650');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 8', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tSales',
    'East\t100',
    'North\t200',
    'East\t300',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('300');

  const editor = await createPivotEditor(page, 'A1', 'B4');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Sales$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^SUM$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await columnHeader(page, 'B').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(delete column)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B1')).toHaveText('');

  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.getByRole('button', { name: /^(refresh pivot table)$/i }).click();
  await expect(page.getByText(
    /^(pivot field is no longer available\. select a new field\.)$/i,
  )).toBeVisible();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await worksheetTab(page, 'Pivot1').click();
  await expectActiveWorksheet(page, 'Pivot1');
  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('400');
  await expect(gridCell(page, 'B3')).toHaveText('200');
  await expect(gridCell(page, 'B4')).toHaveText('600');
});

test('REQ-5.3.1: Create and Refresh a Basic Pivot Table - Scenario 9', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Region\tStatus',
    'East\tOpen',
    'East\tClosed',
    'North\tOpen',
    'South\tOpen',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B5')).toHaveText('Open');

  const editor = await createPivotEditor(page, 'A1', 'B5');
  await chooseEditorOption(page, editor, /^(rows)$/i, /^Region$/i);
  await chooseEditorOption(page, editor, /^(values)$/i, /^Status$/i);
  await chooseEditorOption(page, editor, /^(summarize by)$/i, /^COUNT$/i);
  await editor.getByRole('button', { name: /^(apply)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('COUNT of Status');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'B3')).toHaveText('1');
  await expect(gridCell(page, 'A4')).toHaveText('South');
  await expect(gridCell(page, 'B4')).toHaveText('1');
  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'B3')).toHaveText('1');
});
