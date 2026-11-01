import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  commitCellThroughGrid,
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectSelectedCell,
  formulaBar,
  gridCell,
  inlineCellEditor,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.1.1: Edit a Cell Through the Grid or Formula Bar - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await gridCell(page, 'A1').click();
  await expectSelectedCell(page, 'A1');
  await expect(gridCell(page, 'A1')).toHaveText('2');
  await expect(formulaBar(page)).toHaveValue('2');
  await expect(gridCell(page, 'B1')).toHaveText('4');

  await commitCellThroughFormulaBar(page, 'A1', '3');
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await gridCell(page, 'A1').click();
  await expectSelectedCell(page, 'A1');
  await expect(formulaBar(page)).toHaveValue('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');

  await gridCell(page, 'B1').click();
  await expectSelectedCell(page, 'B1');
  await expect(formulaBar(page)).toHaveValue('=A1*2');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
});

test('REQ-3.1.1: Edit a Cell Through the Grid or Formula Bar - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Saved value');

  await gridCell(page, 'A1').dblclick();
  const editor = inlineCellEditor(page, 'A1');
  await expect(editor).toBeVisible();
  await editor.fill('Unsaved value');
  await editor.press('Escape');

  await expect(editor).toHaveCount(0);
  await expect(gridCell(page, 'A1')).toHaveText('Saved value');
  await expect(formulaBar(page)).toHaveValue('Saved value');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Saved value');
  await expect(page.getByText('Unsaved value', { exact: true })).toHaveCount(0);
});

test('REQ-3.1.1: Edit a Cell Through the Grid or Formula Bar - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  const values = [
    { cell: 'A1', raw: 'Plain text', visible: 'Plain text' },
    { cell: 'A2', raw: '42', visible: '42' },
    { cell: 'A3', raw: 'TRUE', visible: 'TRUE' },
    { cell: 'A4', raw: '2026-08-06', visible: '2026-08-06' },
    { cell: 'A5', raw: '=A2*2', visible: '84' },
  ];

  for (const value of values) {
    await commitCellThroughGrid(page, value.cell, value.raw);
    await expect(gridCell(page, value.cell)).toHaveText(value.visible);
    await gridCell(page, value.cell).click();
    await expect(formulaBar(page)).toHaveValue(value.raw);
  }

  await gridCell(page, 'B1').dblclick();
  const editor = inlineCellEditor(page, 'B1');
  await editor.fill('Committed by selection change');
  await gridCell(page, 'B2').click();
  await expect(editor).toHaveCount(0);
  await expect(gridCell(page, 'B1')).toHaveText('Committed by selection change');

  await page.reload();
  for (const value of values) {
    await expect(gridCell(page, value.cell)).toHaveText(value.visible);
  }
  await expect(gridCell(page, 'B1')).toHaveText('Committed by selection change');
  await gridCell(page, 'A5').click();
  await expect(formulaBar(page)).toHaveValue('=A2*2');
});

test('REQ-3.1.1: Edit a Cell Through the Grid or Formula Bar - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'C3', '7');
  await commitCellThroughFormulaBar(page, 'D4', '=C3*3');

  await expect(gridCell(page, 'C3')).toHaveText('7');
  await expect(gridCell(page, 'D4')).toHaveText('21');
  await gridCell(page, 'D4').click();
  await expect(formulaBar(page)).toHaveValue('=C3*3');

  await page.reload();
  await expect(gridCell(page, 'C3')).toHaveText('7');
  await expect(gridCell(page, 'D4')).toHaveText('21');
  await gridCell(page, 'D4').click();
  await expect(formulaBar(page)).toHaveValue('=C3*3');
});
