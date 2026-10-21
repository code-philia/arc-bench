import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
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

test('REQ-3.1.2: Paste Two-Dimensional Table Data - Scenario 1', async ({ page }) => {
  const tabularText = 'Alpha\t\t3\nBeta\tMiddle\t4';

  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Outside');
  await commitCellThroughFormulaBar(page, 'E4', 'Keep');
  await expect(gridCell(page, 'A1')).toHaveText('Outside');
  await expect(gridCell(page, 'E4')).toHaveText('Keep');
  await setClipboardText(page, tabularText);

  await gridCell(page, 'B2').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'B2')).toHaveText('Alpha');
  await expect(gridCell(page, 'C2')).toHaveText('');
  await expect(gridCell(page, 'D2')).toHaveText('3');
  await expect(gridCell(page, 'B3')).toHaveText('Beta');
  await expect(gridCell(page, 'C3')).toHaveText('Middle');
  await expect(gridCell(page, 'D3')).toHaveText('4');
  await expect(gridCell(page, 'A1')).toHaveText('Outside');
  await expect(gridCell(page, 'E4')).toHaveText('Keep');

  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('Alpha');
  await expect(gridCell(page, 'C2')).toHaveText('');
  await expect(gridCell(page, 'D2')).toHaveText('3');
  await expect(gridCell(page, 'B3')).toHaveText('Beta');
  await expect(gridCell(page, 'C3')).toHaveText('Middle');
  await expect(gridCell(page, 'D3')).toHaveText('4');
  await expect(gridCell(page, 'A1')).toHaveText('Outside');
  await expect(gridCell(page, 'E4')).toHaveText('Keep');
});

test('REQ-3.1.2: Paste Two-Dimensional Table Data - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '10');
  await commitCellThroughFormulaBar(page, 'A2', '20');
  await configureNumberValidation(page, 'A1', 'A2', '0', '100');
  await setClipboardText(page, '50\n120');

  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');

  await expect(page.getByText(/enter a number from 0 to 100/)).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('10');
  await expect(gridCell(page, 'A2')).toHaveText('20');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('10');
  await expect(gridCell(page, 'A2')).toHaveText('20');
});

test('REQ-3.1.2: Paste Two-Dimensional Table Data - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await commitCellThroughFormulaBar(page, 'C1', '=B1+1');
  await setClipboardText(page, '3\t5');

  await gridCell(page, 'A1').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(paste)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('5');
  await expect(gridCell(page, 'C1')).toHaveText('6');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('5');
  await gridCell(page, 'C1').click();
  await expect(formulaBar(page)).toHaveValue('=B1+1');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('5');
  await expect(gridCell(page, 'C1')).toHaveText('6');
});

test('REQ-3.1.2: Paste Two-Dimensional Table Data - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'E4', 'Keep');
  await setClipboardText(page, 'Alpha\t\tGamma');

  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Gamma');
  await expect(gridCell(page, 'E4')).toHaveText('Keep');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Alpha');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'C1')).toHaveText('Gamma');
});

test('REQ-3.1.2: Paste Two-Dimensional Table Data - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Outside');
  await setClipboardText(page, 'One\tTwo\nThree\tFour');

  await gridCell(page, 'C3').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'C3')).toHaveText('One');
  await expect(gridCell(page, 'D3')).toHaveText('Two');
  await expect(gridCell(page, 'C4')).toHaveText('Three');
  await expect(gridCell(page, 'D4')).toHaveText('Four');
  await expect(gridCell(page, 'A1')).toHaveText('Outside');
  await page.reload();
  await expect(gridCell(page, 'C3')).toHaveText('One');
  await expect(gridCell(page, 'D4')).toHaveText('Four');
});
