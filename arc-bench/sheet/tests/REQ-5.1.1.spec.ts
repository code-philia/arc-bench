import { baseUrl } from './support/e2e';
import { expect, Locator, Page, test } from '@playwright/test';
import {
  commitCellThroughFormulaBar,
  configureNumberValidation,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  openDataMenu,
  selectCellRange,
  setClipboardText,
} from './support/e2e';

async function chooseOption(
  page: Page,
  scope: Locator,
  label: RegExp,
  option: RegExp,
): Promise<void> {
  await scope.getByLabel(label).click();
  await page.getByRole('option', { name: option }).click();
}

async function sortSelectedRange(
  page: Page,
  column: RegExp,
  order: RegExp,
): Promise<void> {
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(sort range)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(sort range)$/i });
  await chooseOption(page, dialog, /^(sort by)$/i, column);
  await chooseOption(page, dialog, /^(order)$/i, order);
  await dialog.getByRole('checkbox', { name: /^(data has header row)$/i }).check();
  await dialog.getByRole('button', { name: /^(sort)$/i }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, 'Region\tSales\tStatus\t\tOutside\nEast\t1200\tOpen\nNorth\t800\tClosed\nSouth\t1200\tPending\nWest\t500\tOpen');
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('Sales');
  await expect(gridCell(page, 'C1')).toHaveText('Status');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'A3')).toHaveText('North');
  await expect(gridCell(page, 'A4')).toHaveText('South');
  await expect(gridCell(page, 'A5')).toHaveText('West');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');

  await selectCellRange(page, 'A1', 'C5');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(sort range)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(sort range)$/i });
  await expect(dialog).toBeVisible();
  await chooseOption(page, dialog, /^(sort by)$/i, /^Sales$/i);
  await chooseOption(page, dialog, /^(order)$/i, /^(descending)$/i);
  await dialog.getByRole('checkbox', { name: /^(data has header row)$/i }).check();
  await dialog.getByRole('button', { name: /^(sort)$/i }).click();

  await expect(gridCell(page, 'A1')).toHaveText('Region');
  await expect(gridCell(page, 'B1')).toHaveText('Sales');
  await expect(gridCell(page, 'C1')).toHaveText('Status');
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'B2')).toHaveText('1200');
  await expect(gridCell(page, 'C2')).toHaveText('Open');
  await expect(gridCell(page, 'A3')).toHaveText('South');
  await expect(gridCell(page, 'B3')).toHaveText('1200');
  await expect(gridCell(page, 'C3')).toHaveText('Pending');
  await expect(gridCell(page, 'A4')).toHaveText('North');
  await expect(gridCell(page, 'B4')).toHaveText('800');
  await expect(gridCell(page, 'C4')).toHaveText('Closed');
  await expect(gridCell(page, 'A5')).toHaveText('West');
  await expect(gridCell(page, 'B5')).toHaveText('500');
  await expect(gridCell(page, 'C5')).toHaveText('Open');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('East');
  await expect(gridCell(page, 'A3')).toHaveText('South');
  await expect(gridCell(page, 'A4')).toHaveText('North');
  await expect(gridCell(page, 'A5')).toHaveText('West');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Name\tDate\tValue',
    'Charlie\t2026-03-10\t30',
    'Alpha\t2026-01-15\t10',
    'Bravo\t2026-02-01\t20',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'C4')).toHaveText('20');

  await selectCellRange(page, 'A1', 'C4');
  await sortSelectedRange(page, /^Name$/i, /^(ascending)$/i);
  await expect(gridCell(page, 'A2')).toHaveText('Alpha');
  await expect(gridCell(page, 'A3')).toHaveText('Bravo');
  await expect(gridCell(page, 'A4')).toHaveText('Charlie');
  await expect(gridCell(page, 'B2')).toHaveText('2026-01-15');
  await expect(gridCell(page, 'C2')).toHaveText('10');

  await selectCellRange(page, 'A1', 'C4');
  await sortSelectedRange(page, /^Date$/i, /^(descending)$/i);
  await expect(gridCell(page, 'A2')).toHaveText('Charlie');
  await expect(gridCell(page, 'B2')).toHaveText('2026-03-10');
  await expect(gridCell(page, 'C2')).toHaveText('30');
  await expect(gridCell(page, 'A3')).toHaveText('Bravo');
  await expect(gridCell(page, 'B3')).toHaveText('2026-02-01');
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');
  await expect(gridCell(page, 'B4')).toHaveText('2026-01-15');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Charlie');
  await expect(gridCell(page, 'A3')).toHaveText('Bravo');
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Item\tScore\tDouble',
    'Alpha\t3\t',
    'Bravo\t1\t',
    'Charlie\t2\t',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('2');
  await commitCellThroughFormulaBar(page, 'C2', '=B2*2');
  await commitCellThroughFormulaBar(page, 'C3', '=B3*2');
  await commitCellThroughFormulaBar(page, 'C4', '=B4*2');
  await configureNumberValidation(page, 'B2', 'B4', '0', '10');

  await selectCellRange(page, 'A1', 'C4');
  await sortSelectedRange(page, /^Score$/i, /^(ascending)$/i);

  await expect(gridCell(page, 'A2')).toHaveText('Bravo');
  await expect(gridCell(page, 'B2')).toHaveText('1');
  await expect(gridCell(page, 'C2')).toHaveText('2');
  await expect(gridCell(page, 'A3')).toHaveText('Charlie');
  await expect(gridCell(page, 'B3')).toHaveText('2');
  await expect(gridCell(page, 'C3')).toHaveText('4');
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');
  await expect(gridCell(page, 'B4')).toHaveText('3');
  await expect(gridCell(page, 'C4')).toHaveText('6');
  for (const row of [2, 3, 4]) {
    await gridCell(page, `C${row}`).click();
    await expect(formulaBar(page)).toHaveValue(`=B${row}*2`);
  }

  await commitCellThroughFormulaBar(page, 'B2', '11', { expectChange: false });
  await expect(page.getByText(/enter a number from 0 to 10/)).toBeVisible();
  await expect(gridCell(page, 'B2')).toHaveText('1');
  await expect(gridCell(page, 'C2')).toHaveText('2');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Bravo');
  await expect(gridCell(page, 'B2')).toHaveText('1');
  await expect(gridCell(page, 'C2')).toHaveText('2');
  await gridCell(page, 'C2').click();
  await expect(formulaBar(page)).toHaveValue('=B2*2');
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Item\tScore',
    'Alpha\t3',
    'Bravo\t1',
    'Charlie\t2',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'B4')).toHaveText('2');
  await selectCellRange(page, 'A1', 'B4');
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(create filter)$/i }).click();
  const scoreFilterButton = page
    .getByRole('grid', { name: /^(worksheet grid)$/i })
    .getByRole('button', { name: /^(filter Score)$/i });
  await scoreFilterButton.click();
  const filterDialog = page.getByRole('dialog', { name: /^(filter Score)$/i });
  await filterDialog.getByLabel(/^(condition)$/i).click();
  await page.getByRole('option', { name: /^(greater than)$/i }).click();
  await filterDialog.getByLabel(/^(value)$/i).fill('1');
  await filterDialog.getByRole('button', { name: /^(apply)$/i }).click();
  await expect(gridCell(page, 'A2')).toBeVisible();
  await expect(gridCell(page, 'A3')).not.toBeVisible();
  await expect(gridCell(page, 'A4')).toBeVisible();

  await selectCellRange(page, 'A1', 'B4');
  await sortSelectedRange(page, /^Score$/i, /^(ascending)$/i);

  await expect(scoreFilterButton).toBeVisible();
  await expect(gridCell(page, 'A2')).not.toBeVisible();
  await expect(gridCell(page, 'A3')).toBeVisible();
  await expect(gridCell(page, 'A3')).toHaveText('Charlie');
  await expect(gridCell(page, 'A4')).toBeVisible();
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');

  await page.reload();
  await expect(scoreFilterButton).toBeVisible();
  await expect(gridCell(page, 'A2')).not.toBeVisible();
  await expect(gridCell(page, 'A3')).toBeVisible();
  await expect(gridCell(page, 'A3')).toHaveText('Charlie');
  await expect(gridCell(page, 'A4')).toBeVisible();
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');

  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(clear filter)$/i }).click();
  await expect(gridCell(page, 'A2')).toBeVisible();
  await expect(gridCell(page, 'A2')).toHaveText('Bravo');
  await expect(gridCell(page, 'A3')).toHaveText('Charlie');
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Item\tScore\tNote',
    'Alpha\t3\tFirst',
    'Bravo\t3\tSecond',
    'Charlie\t1\tThird',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await selectCellRange(page, 'A1', 'C4');
  await sortSelectedRange(page, /^Score$/i, /^(ascending)$/i);

  await expect(gridCell(page, 'A2')).toHaveText('Charlie');
  await expect(gridCell(page, 'A3')).toHaveText('Alpha');
  await expect(gridCell(page, 'A4')).toHaveText('Bravo');
  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Charlie');
  await expect(gridCell(page, 'A3')).toHaveText('Alpha');
  await expect(gridCell(page, 'A4')).toHaveText('Bravo');
});

test('REQ-5.1.1: Sort a Data Range by a Specified Column - Scenario 6', async ({ page }) => {
  await createBlankWorkbook(page);
  await setClipboardText(page, [
    'Name\tDate\tCity',
    'Alpha\t2026-01-10\tShanghai',
    'Bravo\t2026-03-20\tBeijing',
    'Charlie\t2026-02-15\tTianjin',
  ].join('\n'));
  await gridCell(page, 'A1').click();
  await page.keyboard.press('Control+V');
  await expect(gridCell(page, 'C4')).toHaveText('Tianjin');
  await commitCellThroughFormulaBar(page, 'E1', 'Outside');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');
  await selectCellRange(page, 'A1', 'C4');
  await sortSelectedRange(page, /^Date$/i, /^(descending)$/i);

  await expect(gridCell(page, 'A2')).toHaveText('Bravo');
  await expect(gridCell(page, 'A3')).toHaveText('Charlie');
  await expect(gridCell(page, 'A4')).toHaveText('Alpha');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');
  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('Bravo');
  await expect(gridCell(page, 'E1')).toHaveText('Outside');
});
