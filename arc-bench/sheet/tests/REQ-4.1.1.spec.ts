import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  setClipboardText,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.1.1: Calculate Basic Expressions and Aggregate Functions - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '3');
  await commitCellThroughFormulaBar(page, 'B1', '4');
  await expect(gridCell(page, 'C1')).toHaveText('');

  await commitCellThroughFormulaBar(page, 'C1', '=(A1+B1)*2');
  await expect(gridCell(page, 'C1')).toHaveText('14');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=(A1+B1)*2');

  await page.reload();
  await expect(gridCell(page, 'C1')).toHaveText('14');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=(A1+B1)*2');
});

test('REQ-4.1.1: Calculate Basic Expressions and Aggregate Functions - Scenario 2', async ({ page }) => {
  const formulas = [
    { cell: 'D2', expression: '=sum(B2:B10)', result: '12' },
    { cell: 'D3', expression: '=AVERAGE(B2:B10)', result: '4' },
    { cell: 'D4', expression: '=COUNT(B2:B10)', result: '3' },
    { cell: 'D5', expression: '=MIN(B2:B10)', result: '2' },
    { cell: 'D6', expression: '=MAX(B2:B10)', result: '6' },
  ];

  await createBlankWorkbook(page);
  await setClipboardText(page, '2\n\n4\n\n6\n\nnot numeric\nTRUE');
  await gridCell(page, 'B2').click();
  await page.keyboard.press('Control+V');
  await setClipboardText(page, formulas.map((formula) => formula.expression).join('\n'));
  await gridCell(page, 'D2').click();
  await page.keyboard.press('Control+V');

  for (const formula of formulas) {
    await expect(gridCell(page, formula.cell)).toHaveText(formula.result);
    await gridCell(page, formula.cell).click();
    await expect(formulaBar(page)).toHaveValue(formula.expression);
  }

  await page.reload();
  for (const formula of formulas) {
    await expect(gridCell(page, formula.cell)).toHaveText(formula.result);
    await gridCell(page, formula.cell).click();
    await expect(formulaBar(page)).toHaveValue(formula.expression);
  }
});

test('REQ-4.1.1: Calculate Basic Expressions and Aggregate Functions - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '9');
  await commitCellThroughFormulaBar(page, 'B1', '3');
  const formulas = [
    { cell: 'C1', expression: '=A1-B1', result: '6' },
    { cell: 'C2', expression: '=A1/B1', result: '3' },
    { cell: 'C3', expression: '=10-3*2', result: '4' },
    { cell: 'C4', expression: '=42', result: '42' },
  ];

  for (const formula of formulas) {
    await commitCellThroughFormulaBar(page, formula.cell, formula.expression);
    await expect(gridCell(page, formula.cell)).toHaveText(formula.result);
    await gridCell(page, formula.cell).click();
    await expect(formulaBar(page)).toHaveValue(formula.expression);
  }

  await page.reload();
  for (const formula of formulas) {
    await expect(gridCell(page, formula.cell)).toHaveText(formula.result);
    await gridCell(page, formula.cell).click();
    await expect(formulaBar(page)).toHaveValue(formula.expression);
  }
});

test('REQ-4.1.1: Calculate Basic Expressions and Aggregate Functions - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '8');
  await commitCellThroughFormulaBar(page, 'B1', '4');
  await commitCellThroughFormulaBar(page, 'C1', '2');

  await commitCellThroughFormulaBar(page, 'D1', '=(A1+B1)*C1');
  await commitCellThroughFormulaBar(page, 'D2', '=A1-B1/2');

  await expect(gridCell(page, 'D1')).toHaveText('24');
  await expect(gridCell(page, 'D2')).toHaveText('6');
  await gridCell(page, 'D1').click();
  await expect(formulaBar(page)).toHaveValue('=(A1+B1)*C1');

  await page.reload();
  await expect(gridCell(page, 'D1')).toHaveText('24');
  await expect(gridCell(page, 'D2')).toHaveText('6');
});

test('REQ-4.1.1: Calculate Basic Expressions and Aggregate Functions - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '5');
  await commitCellThroughFormulaBar(page, 'B1', '6');
  await commitCellThroughFormulaBar(page, 'C1', '4');

  await commitCellThroughFormulaBar(page, 'D1', '=A1*B1+C1');
  await commitCellThroughFormulaBar(page, 'D2', '=(A1+B1)/C1');

  await expect(gridCell(page, 'D1')).toHaveText('34');
  await expect(gridCell(page, 'D2')).toHaveText('2.75');
  await page.reload();
  await expect(gridCell(page, 'D1')).toHaveText('34');
  await expect(gridCell(page, 'D2')).toHaveText('2.75');
});
