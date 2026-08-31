import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.9
// fixtures: passenger_manager_user

test('REQ-4.4.9: Confirm batch deletion of selected passengers', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('row', { name: /Delete Passenger One/ }).getByRole('checkbox').check();
  await page.getByRole('row', { name: /Delete Passenger Two/ }).getByRole('checkbox').check();
  await h.clickNamed(page, 'Batch deletion');
  await h.expectDialog(page, 'Are you sure you want to delete the selected passengers?');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await h.expectSuccessFeedback(page);
  await expect(page.getByRole('cell', { name: 'Delete Passenger One' })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: 'Delete Passenger Two' })).toHaveCount(0);
});

test('REQ-4.4.9: Cancel batch deletion of selected passengers', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('row', { name: /Delete Passenger Three/ }).getByRole('checkbox').check();
  await page.getByRole('row', { name: /Delete Passenger Four/ }).getByRole('checkbox').check();
  await h.clickNamed(page, 'Batch deletion');
  await h.expectDialog(page, 'Are you sure you want to delete the selected passengers?');
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click();
  await h.expectTextsVisible(page, ['Delete Passenger Three', 'Delete Passenger Four']);
});
