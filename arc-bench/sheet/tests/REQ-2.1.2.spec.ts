import { baseUrl } from './support/e2e';
import { expect, Page, test } from '@playwright/test';
import {
  addWorksheet,
  commitCellThroughFormulaBar,
  configureDropdownValidation,
  createBlankWorkbook,
  expectActiveWorksheet,
  expectSelectedCell,
  gridCell,
  openDataMenu,
  setClipboardText,
  selectCellRange,
  worksheetTab,
} from './support/e2e';

async function expectWorksheetState(
  page: Page,
  worksheetName: string,
  selectedCell: string,
  cellValue: string,
): Promise<void> {
  await expectActiveWorksheet(page, worksheetName);
  await expectSelectedCell(page, selectedCell);
  if (cellValue.startsWith('=')) {
    await expect(gridCell(page, selectedCell)).not.toHaveText('');
  } else {
    await expect(gridCell(page, selectedCell)).toHaveText(cellValue);
  }
  await expect(page.getByLabel(/^(formula bar)$/i)).toHaveValue(cellValue);
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.1.2: Switch Worksheets - Scenario 1', async ({ page }) => {
  const firstWorksheet = 'Sheet1';
  const firstSelectedCell = 'B1';
  const firstCellValue = '=A1*2';
  const secondWorksheet = 'Sheet2';
  const secondSelectedCell = 'A1';
  const secondCellValue = 'Other';
  await createBlankWorkbook(page);
  await setClipboardText(page, `2\t${firstCellValue}`);
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('2');
  await expect(gridCell(page, 'B1')).toHaveText('4');
  await gridCell(page, 'B1').click();
  await addWorksheet(page, secondWorksheet);
  await setClipboardText(page, secondCellValue);
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText(secondCellValue);
  await gridCell(page, 'A1').click();
  await worksheetTab(page, firstWorksheet).click();
  await expectWorksheetState(page, firstWorksheet, firstSelectedCell, firstCellValue);

  await worksheetTab(page, secondWorksheet).click();
  await expectWorksheetState(page, secondWorksheet, secondSelectedCell, secondCellValue);

  await worksheetTab(page, firstWorksheet).click();
  await expectWorksheetState(page, firstWorksheet, firstSelectedCell, firstCellValue);

  await page.reload();
  await expectWorksheetState(page, firstWorksheet, firstSelectedCell, firstCellValue);
});

test('REQ-2.1.2: Switch Worksheets - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await gridCell(page, 'B1').click();
  await expectSelectedCell(page, 'B1');

  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'A1', 'Other');
  await gridCell(page, 'A1').click();
  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expectSelectedCell(page, 'B1');
  await expect(gridCell(page, 'B1')).toHaveText('4');
  await expect(page.getByLabel(/^(formula bar)$/i)).toHaveValue('=A1*2');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await expectSelectedCell(page, 'A1');
  await expect(gridCell(page, 'A1')).toHaveText('Other');
  await expect(page.getByLabel(/^(formula bar)$/i)).toHaveValue('Other');
  await page.reload();
  await expectActiveWorksheet(page, 'Sheet2');
  await expectSelectedCell(page, 'A1');
  await expect(gridCell(page, 'A1')).toHaveText('Other');
});

test('REQ-2.1.2: Switch Worksheets - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tStatus\nEast\tOpen\nNorth\tClosed');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B3')).toHaveText('Closed');
  await configureDropdownValidation(page, 'C2', 'C2', ['Open', 'Closed']);
  await selectCellRange(page, 'A1', 'B3');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create filter)$/i }).click();

  const filterButton = page
    .getByRole('grid', { name: /^(worksheet grid)$/i })
    .getByRole('button', { name: /^(filter Region)$/i });
  const dropdownButton = page.getByRole('button', {
    name: /^(open dropdown for C2)$/i,
  });
  await expect(filterButton).toBeVisible();
  await expect(dropdownButton).toBeVisible();

  await addWorksheet(page, 'Sheet2');
  await expect(filterButton).toHaveCount(0);
  await expect(dropdownButton).toHaveCount(0);
  await commitCellThroughFormulaBar(page, 'A1', 'Other sheet');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(filterButton).toBeVisible();
  await expect(dropdownButton).toBeVisible();
  await expect(gridCell(page, 'A2')).toHaveText('East');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await page.reload();
  await expectActiveWorksheet(page, 'Sheet2');
  await expect(gridCell(page, 'A1')).toHaveText('Other sheet');
  await expect(filterButton).toHaveCount(0);
  await expect(dropdownButton).toHaveCount(0);
});

test('REQ-2.1.2: Switch Worksheets - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Sheet1');
  await gridCell(page, 'A1').click();
  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'B2', 'Sheet2');
  await gridCell(page, 'B2').click();
  await addWorksheet(page, 'Sheet3');
  await commitCellThroughFormulaBar(page, 'C3', 'Sheet3');
  await gridCell(page, 'C3').click();

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expectSelectedCell(page, 'A1');
  await expect(gridCell(page, 'A1')).toHaveText('Sheet1');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await expectSelectedCell(page, 'B2');
  await expect(gridCell(page, 'B2')).toHaveText('Sheet2');

  await worksheetTab(page, 'Sheet3').click();
  await expectActiveWorksheet(page, 'Sheet3');
  await expectSelectedCell(page, 'C3');
  await expect(gridCell(page, 'C3')).toHaveText('Sheet3');

  await page.reload();
  await expectActiveWorksheet(page, 'Sheet3');
  await expectSelectedCell(page, 'C3');
});

test('REQ-2.1.2: Switch Worksheets - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*3');
  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'A1', 'Other');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await gridCell(page, 'B1').click();
  await expect(page.getByLabel(/^(formula bar)$/i)).toHaveValue('=A1*3');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await expect(gridCell(page, 'A1')).toHaveText('Other');
  await gridCell(page, 'A1').click();
  await expect(page.getByLabel(/^(formula bar)$/i)).toHaveValue('Other');
});
