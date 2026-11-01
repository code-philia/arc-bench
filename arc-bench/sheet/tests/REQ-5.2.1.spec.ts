import { baseUrl } from './support/e2e';
import { expect, Locator, Page, test } from '@playwright/test';
import {
  commitCellThroughGrid,
  commitCellThroughFormulaBar,
  configureDropdownValidation,
  configureNumberValidation,
  createBlankWorkbook,
  formulaBar,
  gridCell,
  openDataMenu,
  selectCellRange,
} from './support/e2e';

async function openDataValidation(page: Page, start: string, end: string): Promise<Locator> {
  await selectCellRange(page, start, end);
  await openDataMenu(page);
  await page.getByRole('menuitem', { name: /^(data validation)$/i }).click();
  const dialog = page.getByRole('dialog', { name: /^(data validation)$/i });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function chooseRuleType(page: Page, dialog: Locator, option: string): Promise<void> {
  await dialog.getByLabel('Rule type', { exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);

  const dialog = await openDataValidation(page, 'A1', 'A2');
  await chooseRuleType(page, dialog, 'Dropdown');
  await dialog.getByLabel(/^(allowed values)$/i).fill('Not Started, In Progress, Completed');
  await dialog.getByRole('button', { name: /^(save)$/i }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: /^(open dropdown for A1)$/i }).click();
  await page.getByRole('option', { name: /^In Progress$/i }).click();
  await expect(gridCell(page, 'A1')).toHaveText('In Progress');
  await expect(page.getByRole('button', { name: /^(open dropdown for A2)$/i })).toBeVisible();

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('In Progress');
  await expect(page.getByRole('button', { name: /^(open dropdown for A1)$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^(open dropdown for A2)$/i })).toBeVisible();
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '50');

  const dialog = await openDataValidation(page, 'A1', 'A1');
  await chooseRuleType(page, dialog, 'Number range');
  await dialog.getByLabel(/^(minimum)$/i).fill('0');
  await dialog.getByLabel(/^(maximum)$/i).fill('100');
  await dialog.getByRole('button', { name: /^(save)$/i }).click();
  await expect(dialog).toBeHidden();

  await commitCellThroughFormulaBar(page, 'A1', '120', { expectChange: false });
  await expect(page.getByText('Please enter a number between 0 and 100', { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('50');
  await gridCell(page, 'A1').click();
  await expect(formulaBar(page)).toHaveValue('50');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('50');
  await commitCellThroughFormulaBar(page, 'A1', '101', { expectChange: false });
  await expect(page.getByText('Please enter a number between 0 and 100', { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('50');

  await commitCellThroughFormulaBar(page, 'A1', '100');
  await expect(gridCell(page, 'A1')).toHaveText('100');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('100');
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '50');
  await configureNumberValidation(page, 'A1', 'A1', '0', '100');

  await commitCellThroughGrid(page, 'A1', '120', { expectChange: false });
  await expect(page.getByText('Please enter a number between 0 and 100', { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('50');
  await gridCell(page, 'A1').click();
  await expect(formulaBar(page)).toHaveValue('50');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('50');
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '50');
  await configureNumberValidation(page, 'A1', 'A1', '0', '100');

  const editDialog = await openDataValidation(page, 'A1', 'A1');
  await expect(editDialog.getByLabel(/^(minimum)$/i)).toHaveValue('0');
  await expect(editDialog.getByLabel(/^(maximum)$/i)).toHaveValue('100');
  await editDialog.getByLabel(/^(minimum)$/i).fill('10');
  await editDialog.getByLabel(/^(maximum)$/i).fill('60');
  await editDialog.getByRole('button', { name: /^(save)$/i }).click();
  await expect(editDialog).toBeHidden();
  await expect(gridCell(page, 'A1')).toHaveText('50');

  await commitCellThroughFormulaBar(page, 'A1', '5', { expectChange: false });
  await expect(page.getByText('Please enter a number between 10 and 60', { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('50');

  const deleteDialog = await openDataValidation(page, 'A1', 'A1');
  await deleteDialog.getByRole('button', { name: /^(delete rule)$/i }).click();
  await expect(deleteDialog).toBeHidden();
  await expect(gridCell(page, 'A1')).toHaveText('50');
  await commitCellThroughFormulaBar(page, 'A1', '5');
  await expect(gridCell(page, 'A1')).toHaveText('5');

  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('5');
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 5', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Open');
  await configureDropdownValidation(page, 'A1', 'A1', ['Open', 'Closed']);

  await commitCellThroughFormulaBar(page, 'A1', 'Pending', { expectChange: false });
  await expect(page.getByText(
    'Please select one of the following values: Open, Closed',
    { exact: true },
  )).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('Open');
  await gridCell(page, 'A1').click();
  await expect(formulaBar(page)).toHaveValue('Open');

  await page.reload();
  await commitCellThroughFormulaBar(page, 'A1', 'Pending', { expectChange: false });
  await expect(page.getByText(
    'Please select one of the following values: Open, Closed',
    { exact: true },
  )).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('Open');
});

test('REQ-5.2.1: Set Dropdown or Numeric Validation for a Range - Scenario 6', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Not Started');
  await configureDropdownValidation(page, 'A1', 'A2', ['Not Started', 'In Progress', 'Completed']);

  await commitCellThroughFormulaBar(page, 'A1', 'In Progress');
  await commitCellThroughFormulaBar(page, 'A2', 'Completed');
  await expect(gridCell(page, 'A1')).toHaveText('In Progress');
  await expect(gridCell(page, 'A2')).toHaveText('Completed');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('In Progress');
  await expect(gridCell(page, 'A2')).toHaveText('Completed');
});

