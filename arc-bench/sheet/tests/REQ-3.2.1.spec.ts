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

test('REQ-3.2.1: Copy, Cut, and Paste Cell Ranges - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, '1\t2\n3\t=A1+$B$1');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await setClipboardText(page, 'Keep');
  await gridCell(page, 'G1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('1');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await expect(gridCell(page, 'A2')).toHaveText('3');
  await expect(gridCell(page, 'B2')).toHaveText('3');
  await gridCell(page, 'B2').click();
  await expect(formulaBar(page)).toHaveValue('=A1+$B$1');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');

  await gridCell(page, 'A1').dragTo(gridCell(page, 'B2'));
  await page.keyboard.press('Control+C');
  await gridCell(page, 'D1').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('1');
  await expect(gridCell(page, 'B1')).toHaveText('2');
  await expect(gridCell(page, 'A2')).toHaveText('3');
  await expect(gridCell(page, 'B2')).toHaveText('3');
  await expect(gridCell(page, 'D1')).toHaveText('1');
  await expect(gridCell(page, 'E1')).toHaveText('2');
  await expect(gridCell(page, 'D2')).toHaveText('3');
  await expect(gridCell(page, 'E2')).toHaveText('3');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');
  await gridCell(page, 'E2').click();
  await expect(formulaBar(page)).toHaveValue('=D1+$B$1');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('1');
  await expect(gridCell(page, 'B2')).toHaveText('3');
  await expect(gridCell(page, 'D1')).toHaveText('1');
  await expect(gridCell(page, 'E2')).toHaveText('3');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');
  await gridCell(page, 'E2').click();
  await expect(formulaBar(page)).toHaveValue('=D1+$B$1');
});

test('REQ-3.2.1: Copy, Cut, and Paste Cell Ranges - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'A\tB\nC\tD');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await setClipboardText(page, 'Keep');
  await gridCell(page, 'G1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('A');
  await expect(gridCell(page, 'B1')).toHaveText('B');
  await expect(gridCell(page, 'A2')).toHaveText('C');
  await expect(gridCell(page, 'B2')).toHaveText('D');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');

  await gridCell(page, 'A1').dragTo(gridCell(page, 'B2'));
  await page.keyboard.press('Control+X');
  await gridCell(page, 'D1').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'A2')).toHaveText('');
  await expect(gridCell(page, 'B2')).toHaveText('');
  await expect(gridCell(page, 'D1')).toHaveText('A');
  await expect(gridCell(page, 'E1')).toHaveText('B');
  await expect(gridCell(page, 'D2')).toHaveText('C');
  await expect(gridCell(page, 'E2')).toHaveText('D');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'A2')).toHaveText('');
  await expect(gridCell(page, 'B2')).toHaveText('');
  await expect(gridCell(page, 'D1')).toHaveText('A');
  await expect(gridCell(page, 'E1')).toHaveText('B');
  await expect(gridCell(page, 'D2')).toHaveText('C');
  await expect(gridCell(page, 'E2')).toHaveText('D');
  await expect(gridCell(page, 'G1')).toHaveText('Keep');
});

test('REQ-3.2.1: Copy, Cut, and Paste Cell Ranges - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '10');
  await commitCellThroughFormulaBar(page, 'A2', '120');
  await commitCellThroughFormulaBar(page, 'D1', '1');
  await commitCellThroughFormulaBar(page, 'D2', '2');
  await configureNumberValidation(page, 'D1', 'D2', '0', '100');

  await gridCell(page, 'A1').dragTo(gridCell(page, 'A2'));
  await page.keyboard.press('Control+X');
  await gridCell(page, 'D1').click();
  await page.keyboard.press('Control+V');

  await expect(page.getByText(/enter a number from 0 to 100/)).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('10');
  await expect(gridCell(page, 'A2')).toHaveText('120');
  await expect(gridCell(page, 'D1')).toHaveText('1');
  await expect(gridCell(page, 'D2')).toHaveText('2');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('10');
  await expect(gridCell(page, 'A2')).toHaveText('120');
  await expect(gridCell(page, 'D1')).toHaveText('1');
  await expect(gridCell(page, 'D2')).toHaveText('2');
});

test('REQ-3.2.1: Copy, Cut, and Paste Cell Ranges - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Copied text');
  await commitCellThroughFormulaBar(page, 'B1', 'Copied second cell');

  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+C');
  await gridCell(page, 'D4').click();
  await page.keyboard.press('Control+V');

  await expect(gridCell(page, 'A1')).toHaveText('Copied text');
  await expect(gridCell(page, 'D4')).toHaveText('Copied text');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Copied text');
  await expect(gridCell(page, 'D4')).toHaveText('Copied text');
});
