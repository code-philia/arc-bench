import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  commitCellThroughFormulaBar,
  configureNumberValidation,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  rowHeader,
  setClipboardText,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.2.1: Insert and Delete Rows - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Item\tAmount\nAlpha\t10\nBeta\t20');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('Item');
  await expect(gridCell(page, 'B1')).toHaveText('Amount');
  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'B2')).toHaveText('10');
  await expect(gridCell(page, 'A3')).toHaveText('Beta');
  await expect(gridCell(page, 'B3')).toHaveText('20');

  await rowHeader(page, 3).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row above)$/i }).click();

  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'B2')).toHaveText('10');
  await expect(gridCell(page, 'A3')).toHaveText('');
  await expect(gridCell(page, 'B3')).toHaveText('');
  await expect(gridCell(page, 'A4')).toHaveText('Beta');
  await expect(gridCell(page, 'B4')).toHaveText('20');

  await page.reload();
  await expect(gridCell(page, 'A3')).toHaveText('');
  await expect(gridCell(page, 'B3')).toHaveText('');
  await expect(gridCell(page, 'A4')).toHaveText('Beta');
  await expect(gridCell(page, 'B4')).toHaveText('20');
});

test('REQ-2.2.1: Insert and Delete Rows - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Alpha\nRemove me\nBeta');
  await gridCell(page, 'A2').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'A3')).toHaveText('Remove me');
  await expect(gridCell(page, 'A4')).toHaveText('Beta');

  await rowHeader(page, 3).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(delete row)$/i }).click();

  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'A3')).toHaveText('Beta');
  await expect(gridCell(page, 'A4')).toHaveText('');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'A3')).toHaveText('Beta');
  await expect(gridCell(page, 'A4')).toHaveText('');
});

test('REQ-2.2.1: Insert and Delete Rows - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Alpha');
  await commitCellThroughFormulaBar(page, 'A2', 'Beta');

  await rowHeader(page, 1).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row below)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'A2')).toHaveText('');
  await expect(gridCell(page, 'A3')).toHaveText('Beta');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'A2')).toHaveText('');
  await expect(gridCell(page, 'A3')).toHaveText('Beta');
});

test('REQ-2.2.1: Insert and Delete Rows - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');

  await rowHeader(page, 1).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row above)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'A2')).toHaveText('2');
  await expect(gridCell(page, 'B2')).toHaveText('4');
  await gridCell(page, 'B2').click();
  await expect(formulaBar(page)).toHaveValue('=A2*2');

  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('4');
  await gridCell(page, 'B2').click();
  await expect(formulaBar(page)).toHaveValue('=A2*2');
});

test('REQ-2.2.1: Insert and Delete Rows - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A2', '50');
  await configureNumberValidation(page, 'A2', 'A2', '0', '100');

  await rowHeader(page, 2).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row above)$/i }).click();
  await expect(gridCell(page, 'A2')).toHaveText('');
  await expect(gridCell(page, 'A3')).toHaveText('50');

  await commitCellThroughFormulaBar(page, 'A3', '120', { expectChange: false });
  await expect(page.getByText(/enter a number from 0 to 100/)).toBeVisible();
  await expect(gridCell(page, 'A3')).toHaveText('50');
  await commitCellThroughFormulaBar(page, 'A2', '120');
  await expect(gridCell(page, 'A2')).toHaveText('120');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('120');
  await expect(gridCell(page, 'A3')).toHaveText('50');
});
