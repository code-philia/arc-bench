import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import {
  createBlankWorkbook,
  gridCell,
  selectCellRange,
} from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.1.3: Select a Rectangular Cell Range - Scenario 1', async ({ page }) => {
  await createBlankWorkbook(page);
  await selectCellRange(page, 'A1', 'B3');

  await expect(page.getByRole('grid', { name: /^(worksheet grid)$/i }))
    .toHaveAttribute('aria-multiselectable', 'true');
  for (const coordinate of ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']) {
    await expect(gridCell(page, coordinate)).toHaveAttribute('aria-selected', 'true');
  }
  for (const coordinate of ['C1', 'C2', 'C3']) {
    await expect(gridCell(page, coordinate)).toHaveAttribute('aria-selected', 'false');
  }

  await gridCell(page, 'C1').click();
  await expect(gridCell(page, 'C1')).toHaveAttribute('aria-selected', 'true');
  await expect(gridCell(page, 'A1')).toHaveAttribute('aria-selected', 'false');
  await expect(gridCell(page, 'B3')).toHaveAttribute('aria-selected', 'false');
});

test('REQ-3.1.3: Select a Rectangular Cell Range - Scenario 2', async ({ page }) => {
  await createBlankWorkbook(page);
  await selectCellRange(page, 'A1', 'B3');
  await page.reload();

  for (const coordinate of ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']) {
    await expect(gridCell(page, coordinate)).toHaveAttribute('aria-selected', 'true');
  }
  await expect(gridCell(page, 'C1')).toHaveAttribute('aria-selected', 'false');

  await gridCell(page, 'C1').click();
  await page.reload();
  await expect(gridCell(page, 'C1')).toHaveAttribute('aria-selected', 'true');
  for (const coordinate of ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']) {
    await expect(gridCell(page, coordinate)).toHaveAttribute('aria-selected', 'false');
  }
});
