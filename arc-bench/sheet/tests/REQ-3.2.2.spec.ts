import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  columnHeader,
  commitCellThroughFormulaBar,
  configureDropdownValidation,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  rowHeader,
  setClipboardText,
  uniqueName,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  const value = uniqueName('pw-redo-value');

  await commitCellThroughFormulaBar(page, 'A1', value);
  await expect(gridCell(page, 'A1')).toHaveText(value);

  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(formulaBar(page)).toHaveValue('');

  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText(value);
  await gridCell(page, 'A1').click();
  await expect(formulaBar(page)).toHaveValue(value);

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText(value);
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  const oldBranchValue = uniqueName('pw-old-branch');
  const newBranchValue = uniqueName('pw-new-branch');

  await commitCellThroughFormulaBar(page, 'A1', oldBranchValue);
  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(page.getByRole('button', { name: /^(redo)$/i })).toBeEnabled();

  await commitCellThroughFormulaBar(page, 'A1', newBranchValue);
  await expect(gridCell(page, 'A1')).toHaveText(newBranchValue);
  await expect(page.getByRole('button', { name: /^(redo)$/i })).toBeDisabled();

  await page.keyboard.press('Control+Y');
  await expect(gridCell(page, 'A1')).toHaveText(newBranchValue);
  await expect(page.getByText(oldBranchValue, { exact: true })).toHaveCount(0);

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText(newBranchValue);
  await expect(page.getByText(oldBranchValue, { exact: true })).toHaveCount(0);
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');
  await commitCellThroughFormulaBar(page, 'A1', '3');
  await expect(gridCell(page, 'B1')).toHaveText('6');

  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('2');
  await expect(gridCell(page, 'B1')).toHaveText('4');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');

  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('3');
  await expect(gridCell(page, 'B1')).toHaveText('6');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'A\tB\nC\tD');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('A');
  await expect(gridCell(page, 'B2')).toHaveText('D');

  await page.getByRole('button', { name: /^(undo)$/i }).click();
  for (const coordinate of ['A1', 'B1', 'A2', 'B2']) {
    await expect(gridCell(page, coordinate)).toHaveText('');
  }

  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('A');
  await expect(gridCell(page, 'B1')).toHaveText('B');
  await expect(gridCell(page, 'A2')).toHaveText('C');
  await expect(gridCell(page, 'B2')).toHaveText('D');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('A');
  await expect(gridCell(page, 'B2')).toHaveText('D');
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Left');
  await commitCellThroughFormulaBar(page, 'B1', 'Right');

  await gridCell(page, 'A1').dragTo(gridCell(page, 'B1'));
  await page.keyboard.press('Control+X');
  await gridCell(page, 'D1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'D1')).toHaveText('Left');

  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('Left');
  await expect(gridCell(page, 'B1')).toHaveText('Right');
  await expect(gridCell(page, 'D1')).toHaveText('');
  await expect(gridCell(page, 'E1')).toHaveText('');

  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('');
  await expect(gridCell(page, 'B1')).toHaveText('');
  await expect(gridCell(page, 'D1')).toHaveText('Left');
  await expect(gridCell(page, 'E1')).toHaveText('Right');
  await page.reload();
  await expect(gridCell(page, 'D1')).toHaveText('Left');
  await expect(gridCell(page, 'E1')).toHaveText('Right');
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 6', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Keep');
  await configureDropdownValidation(page, 'A1', 'A1', ['Keep', 'Other']);

  const dropdownFor = (coordinate: string) => page.getByRole('button', {
    name: new RegExp(
      `^(open dropdown for ${coordinate})$`,
      'i',
    ),
  });
  await expect(dropdownFor('A1')).toBeVisible();

  await rowHeader(page, 1).click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 row above)$/i }).click();
  await columnHeader(page, 'A').click({ button: 'right' });
  await page.getByRole('menuitem', { name: /^(insert 1 column left)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('Keep');
  await expect(dropdownFor('B2')).toBeVisible();

  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A2')).toHaveText('Keep');
  await expect(dropdownFor('A2')).toBeVisible();
  await expect(dropdownFor('B2')).toHaveCount(0);
  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('Keep');
  await expect(dropdownFor('A1')).toBeVisible();
  await expect(dropdownFor('A2')).toHaveCount(0);

  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'A2')).toHaveText('Keep');
  await expect(dropdownFor('A2')).toBeVisible();
  await page.getByRole('button', { name: /^(redo)$/i }).click();
  await expect(gridCell(page, 'B2')).toHaveText('Keep');
  await expect(dropdownFor('B2')).toBeVisible();
  await page.reload();
  await expect(gridCell(page, 'B2')).toHaveText('Keep');
  await expect(dropdownFor('B2')).toBeVisible();
});

test('REQ-3.2.2: Undo and Redo Recent Operations - Scenario 7', async ({ page }) => {
  await createBlankWorkbook(page);
  const firstValue = uniqueName('pw-first-workbook');
  await commitCellThroughFormulaBar(page, 'A1', firstValue);

  await createBlankWorkbook(page);
  const secondValue = uniqueName('pw-second-workbook');
  await commitCellThroughFormulaBar(page, 'A1', secondValue);
  await page.getByRole('button', { name: /^(undo)$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('');

  await page.goto(baseUrl());
  await expect(page.getByRole('link')).toHaveCount(2);
  await expect(page.getByText(secondValue, { exact: true })).toHaveCount(0);
});
