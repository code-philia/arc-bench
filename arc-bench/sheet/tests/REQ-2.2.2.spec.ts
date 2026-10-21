import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  columnHeader,
  commitCellThroughFormulaBar,
  configureNumberValidation,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  setClipboardText,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.2.2: Insert and Delete Columns - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Alpha\tBeta\tGamma');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('Beta');
  await expect(gridCell(page, 'C1')).toHaveText('Gamma');

  await columnHeader(page, 'B').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column left)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Beta');
  await expect(gridCell(page, 'D1')).toHaveText('Gamma');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Beta');
  await expect(gridCell(page, 'D1')).toHaveText('Gamma');
});

test('REQ-2.2.2: Insert and Delete Columns - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Unit price\tQuantity\tTotal\n10\t2\t=A2*B2');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('Unit price');
  await expect(gridCell(page, 'B1')).toHaveText('Quantity');
  await expect(gridCell(page, 'C1')).toHaveText('Total');
  await expect(gridCell(page, 'A2')).toHaveText('10');
  await expect(gridCell(page, 'B2')).toHaveText('2');
  await expect(gridCell(page, 'C2')).toHaveText('20');

  await columnHeader(page, 'B').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(delete column)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Unit price');
  await expect(gridCell(page, 'A2')).toHaveText('10');
  await expect(gridCell(page, 'B1')).toHaveText('Total');
  await expect(gridCell(page, 'B2')).toHaveText('#REF!');
  await expect(gridCell(page, 'C1')).toHaveText('');
  await expect(gridCell(page, 'C2')).toHaveText('');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Unit price');
  await expect(gridCell(page, 'A2')).toHaveText('10');
  await expect(gridCell(page, 'B1')).toHaveText('Total');
  await expect(gridCell(page, 'B2')).toHaveText('#REF!');
});

test('REQ-2.2.2: Insert and Delete Columns - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Alpha');
  await commitCellThroughFormulaBar(page, 'B1', 'Beta');

  await columnHeader(page, 'A').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column right)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Beta');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Beta');
});

test('REQ-2.2.2: Insert and Delete Columns - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');

  await columnHeader(page, 'A').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column left)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await expect(gridCell(page, 'C1')).toHaveText('4');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1*2');

  await page.reload();
  await expect(gridCell(page, 'C1')).toHaveText('4');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1*2');
});

test('REQ-2.2.2: Insert and Delete Columns - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'B1', '50');
  await configureNumberValidation(page, 'B1', 'B1', '0', '100');

  await columnHeader(page, 'B').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column left)$/i }).click();
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('50');

  await commitCellThroughFormulaBar(page, 'C1', '120', { expectChange: false });
  await expect(page.getByText(/enter a number from 0 to 100/)).toBeVisible();
  await expect(gridCell(page, 'C1')).toHaveText('50');
  await commitCellThroughFormulaBar(page, 'B1', '120');
  await expect(gridCell(page, 'B1')).toHaveText('120');

  await page.reload();
  await expect(gridCell(page, 'B1')).toHaveText('120');
  await expect(gridCell(page, 'C1')).toHaveText('50');
});
