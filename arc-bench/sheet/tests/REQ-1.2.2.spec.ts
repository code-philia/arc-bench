import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  gridCell,
  openWorkbookHome,
  uniqueName,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-1.2.2: Rename a Workbook - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  const newName = uniqueName('pw-workbook');
  await commitCellThroughFormulaBar(page, 'A1', 'Existing data');

  await page.getByRole('button', { name: /^(rename workbook)$/i }).click();
  const nameInput = page.getByLabel(/^(workbook name)$/i);
  await nameInput.fill(`  ${newName}  `);
  await nameInput.press('Enter');
  await expect(page.getByText(newName, { exact: true })).toBeVisible();

  await openWorkbookHome(page);
  await page.getByRole('link', { name: newName, exact: true }).click();
  await expect(page.getByText(newName, { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('Existing data');

  await page.getByRole('button', { name: /^(rename workbook)$/i }).click();
  await expect(page.getByLabel(/^(workbook name)$/i)).toHaveValue(newName);
});

test('REQ-1.2.2: Rename a Workbook - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);

  await page.getByRole('button', { name: /^(rename workbook)$/i }).click();
  const nameInput = page.getByLabel(/^(workbook name)$/i);
  const originalName = await nameInput.inputValue();
  expect(originalName.trim()).not.toBe('');

  await nameInput.fill('   ');
  await page.getByRole('button', { name: /^(save)$/i }).click();
  await expect(page.getByText(/workbook name cannot be empty/)).toBeVisible();

  await page.reload();
  await expect(page.getByText(originalName, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^(rename workbook)$/i }).click();
  await expect(page.getByLabel(/^(workbook name)$/i)).toHaveValue(originalName);
});
