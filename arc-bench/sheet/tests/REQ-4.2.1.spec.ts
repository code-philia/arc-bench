import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  addWorksheet,
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectActiveWorksheet,
  formulaBar,
  gridCell,
  setClipboardText,
  worksheetTab,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.2.1: Recalculate Dependent Formulas After Source Data Changes - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '10');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await commitCellThroughFormulaBar(page, 'C1', '=B1+5');
  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'A1', 'Other');
  await commitCellThroughFormulaBar(page, 'B1', '=1+1');
  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('10');
  await expect(gridCell(page, 'B1')).toHaveText('20');
  await expect(gridCell(page, 'C1')).toHaveText('25');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1+5');

  await commitCellThroughFormulaBar(page, 'A1', '20');
  await expect(gridCell(page, 'A1')).toHaveText('20');
  await expect(gridCell(page, 'B1')).toHaveText('40');
  await expect(gridCell(page, 'C1')).toHaveText('45');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1+5');

  await worksheetTab(page, 'Sheet2').click();
  await expectActiveWorksheet(page, 'Sheet2');
  await expect(gridCell(page, 'A1')).toHaveText('Other');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=1+1');

  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');
  await page.reload();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('20');
  await expect(gridCell(page, 'B1')).toHaveText('40');
  await expect(gridCell(page, 'C1')).toHaveText('45');
});

test('REQ-4.2.1: Recalculate Dependent Formulas After Source Data Changes - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await commitCellThroughFormulaBar(page, 'C1', '=B1+1');
  await setClipboardText(page, '3');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await expect(gridCell(page, 'C1')).toHaveText('7');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1+1');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await expect(gridCell(page, 'C1')).toHaveText('7');
});

test('REQ-4.2.1: Recalculate Dependent Formulas After Source Data Changes - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '3');
  await commitCellThroughFormulaBar(page, 'C1', '=B1*2');
  await commitCellThroughFormulaBar(page, 'D1', '=C1+1');

  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+X');
  await gridCell(page, 'B1').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await expect(gridCell(page, 'C1')).toHaveText('4');
  await expect(gridCell(page, 'D1')).toHaveText('5');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1*2');
  await gridCell(page, 'D1').click();
  await expect(formulaBar(page)).toHaveValue('=C1+1');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await expect(gridCell(page, 'C1')).toHaveText('4');
  await expect(gridCell(page, 'D1')).toHaveText('5');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1*2');
  await gridCell(page, 'D1').click();
  await expect(formulaBar(page)).toHaveValue('=C1+1');
});
