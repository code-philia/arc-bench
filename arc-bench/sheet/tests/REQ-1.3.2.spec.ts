import { baseUrl } from './support/e2e';
import { expect, Page, test } from '@playwright/test';
import {
  addWorksheet,
  commitCellThroughFormulaBar,
  createBlankWorkbook,
  expectActiveWorksheet,
  formulaBar,
  gridCell,
  normalizeCsv,
  openWorkbookHome,
  readDownload,
  uniqueName,
  worksheetTab,
} from './support/e2e';

async function exportCsv(page: Page): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /^(export csv)$/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  return normalizeCsv(await readDownload(download));
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-1.3.2: Export the Current Worksheet as CSV - Scenario 1', async ({ page }) => {
  const workbookName = uniqueName('pw-export-special');
  const sourceCsv = [
    'Region,Description,Count,Blank,Formula result',
    'West,"Contains, commas",2,,=C2*2',
    'North,"They said ""hello""\n next line",3,,=C3+2',
  ].join('\n');
  const expectedCsv = [
    'Region,Description,Count,Blank,Formula result',
    'West,"Contains, commas",2,,4',
    'North,"They said ""hello""\n next line",3,,5',
  ].join('\n');

  await openWorkbookHome(page);
  await page.getByRole('button', { name: /^(import csv)$/i }).click();
  await page.getByLabel(/^(csv file)$/i).setInputFiles({
    name: `${workbookName}.csv`,
    mimeType: 'text/csv',
    buffer: Buffer.from(sourceCsv, 'utf8'),
  });
  await page.getByRole('button', { name: /^(confirm import)$/i }).click();

  await expect(gridCell(page, 'B2')).toHaveText('Contains, commas');
  await expect(gridCell(page, 'B3')).toHaveText('They said "hello"\n next line');
  await commitCellThroughFormulaBar(page, 'E2', '=C2*2');
  await commitCellThroughFormulaBar(page, 'E3', '=C3+2');
  await expect(gridCell(page, 'E2')).toHaveText('4');
  await expect(gridCell(page, 'E3')).toHaveText('5');
  const firstExport = await exportCsv(page);
  expect(firstExport).toBe(expectedCsv);

  await page.reload();
  await expect(gridCell(page, 'E2')).toHaveText('4');
  await expect(gridCell(page, 'E3')).toHaveText('5');
  const secondExport = await exportCsv(page);
  expect(secondExport).toBe(expectedCsv);
});

test('REQ-1.3.2: Export the Current Worksheet as CSV - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', '2');
  await commitCellThroughFormulaBar(page, 'B1', '=A1*2');

  expect(await exportCsv(page)).toBe('2,4');
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('2');
  await expect(gridCell(page, 'B1')).toHaveText('4');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');

  await page.reload();
  await expectActiveWorksheet(page, 'Sheet1');
  await expect(gridCell(page, 'A1')).toHaveText('2');
  await expect(gridCell(page, 'B1')).toHaveText('4');
  await gridCell(page, 'B1').click();
  await expect(formulaBar(page)).toHaveValue('=A1*2');
});

test('REQ-1.3.2: Export the Current Worksheet as CSV - Scenario 3', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'Sheet1');
  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'A1', 'Sheet2');

  expect(await exportCsv(page)).toBe('Sheet2');
  await expectActiveWorksheet(page, 'Sheet2');
});

test('REQ-1.3.2: Export the Current Worksheet as CSV - Scenario 4', async ({ page }) => {
  await createBlankWorkbook(page);
  await commitCellThroughFormulaBar(page, 'A1', 'First');
  await addWorksheet(page, 'Sheet2');
  await commitCellThroughFormulaBar(page, 'A1', 'Second');
  await worksheetTab(page, 'Sheet1').click();
  await expectActiveWorksheet(page, 'Sheet1');

  expect(await exportCsv(page)).toBe('First');
  await expectActiveWorksheet(page, 'Sheet1');
});
