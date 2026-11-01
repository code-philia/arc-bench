import { baseUrl } from './support/e2e';
import { expect, Page, test } from '@playwright/test';
import {
  expectActiveWorksheet,
  gridCell,
  openWorkbookHome,
  uniqueName,
} from './support/e2e';

async function openCsvImport(page: Page): Promise<void> {
  await openWorkbookHome(page);
  await page.getByRole('button', { name: /^(import csv)$/i }).click();
  await expect(page.getByRole('dialog', { name: /^(import csv)$/i })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-1.3.1: Import CSV to Create a Workbook - Scenario 1', async ({ page }) => {
  const workbookName = uniqueName('pw-import');
  const csv = [
    'Name,Note,Count,Blank',
    'Alex,"Harbor District, East",42,',
    'Jordan,"They said""hello""',
    'next line",3,',
    'Alice,English text,007,',
  ].join('\r\n');

  await openCsvImport(page);
  await page.getByLabel(/^(csv file)$/i).setInputFiles({
    name: `${workbookName}.csv`,
    mimeType: 'text/csv',
    buffer: Buffer.from(csv, 'utf8'),
  });
  await page.getByRole('button', { name: /^(confirm import)$/i }).click();

  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('Name');
  await expect(gridCell(page, 'B1')).toHaveText('Note');
  await expect(gridCell(page, 'C1')).toHaveText('Count');
  await expect(gridCell(page, 'D1')).toHaveText('Blank');
  await expect(gridCell(page, 'A2')).toHaveText('Alex');
  await expect(gridCell(page, 'B2')).toHaveText('Harbor District, East');
  await expect(gridCell(page, 'C2')).toHaveText('42');
  await expect(gridCell(page, 'D2')).toHaveText('');
  await expect(gridCell(page, 'A3')).toHaveText('Jordan');
  await expect(gridCell(page, 'B3')).toHaveText('They said"hello"\n next line');
  await expect(gridCell(page, 'C3')).toHaveText('3');
  await expect(gridCell(page, 'D3')).toHaveText('');
  await expect(gridCell(page, 'A4')).toHaveText('Alice');
  await expect(gridCell(page, 'B4')).toHaveText('English text');
  await expect(gridCell(page, 'C4')).toHaveText('007');
  await expect(gridCell(page, 'D4')).toHaveText('');

  await page.reload();
  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'B2')).toHaveText('Harbor District, East');
  await expect(gridCell(page, 'B3')).toHaveText('They said"hello"\n next line');
  await expect(gridCell(page, 'D2')).toHaveText('');
  await expect(gridCell(page, 'D3')).toHaveText('');
  await expect(gridCell(page, 'B4')).toHaveText('English text');
  await expect(gridCell(page, 'C4')).toHaveText('007');
});

test('REQ-1.3.1: Import CSV to Create a Workbook - Scenario 2', async ({ page }) => {
  const workbookName = uniqueName('pw-invalid-import');

  await openCsvImport(page);
  await page.getByLabel(/^(csv file)$/i).setInputFiles({
    name: `${workbookName}.csv`,
    mimeType: 'text/csv',
    buffer: Buffer.from('Name,Note\r\n Alex,"unfinished quote', 'utf8'),
  });
  await page.getByRole('button', { name: /^(confirm import)$/i }).click();

  await expect(page.getByText(/invalid csv file format\. import failed\./i)).toBeVisible();
  await openWorkbookHome(page);
  await expect(page.getByRole('link', { name: workbookName, exact: true })).toHaveCount(0);
});

test('REQ-1.3.1: Import CSV to Create a Workbook - Scenario 3', async ({ page }) => {
  const workbookName = uniqueName('pw-import');
  const csv = ['City,Description,Count', 'London,Capital,1', 'Berlin,,2', 'Paris,Finance,3'].join('\r\n');

  await openCsvImport(page);
  await page.getByLabel(/^(csv file)$/i).setInputFiles({
    name: `${workbookName}.csv`,
    mimeType: 'text/csv',
    buffer: Buffer.from(csv, 'utf8'),
  });
  await page.getByRole('button', { name: /^(confirm import)$/i }).click();

  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A2')).toHaveText('London');
  await expect(gridCell(page, 'B3')).toHaveText('');
  await expect(gridCell(page, 'C4')).toHaveText('3');

  await page.reload();
  await expect(gridCell(page, 'A2')).toHaveText('London');
  await expect(gridCell(page, 'B3')).toHaveText('');
  await expect(gridCell(page, 'C4')).toHaveText('3');
});

test('REQ-1.3.1: Import CSV to Create a Workbook - Scenario 4', async ({ page }) => {
  const workbookName = uniqueName('pw-single-column-import');
  const csv = ['Title', 'Alpha', 'Beta', 'Gamma'].join('\r\n');

  await openCsvImport(page);
  await page.getByLabel(/^(csv file)$/i).setInputFiles({
    name: `${workbookName}.csv`,
    mimeType: 'text/csv',
    buffer: Buffer.from(csv, 'utf8'),
  });
  await page.getByRole('button', { name: /^(confirm import)$/i }).click();

  await expect(page.getByText(workbookName, { exact: true })).toBeVisible();
  await expect(gridCell(page, 'A1')).toHaveText('Title');
  await expect(gridCell(page, 'A4')).toHaveText('Gamma');
  await page.reload();
  await expect(gridCell(page, 'A1')).toHaveText('Title');
  await expect(gridCell(page, 'A4')).toHaveText('Gamma');
});
