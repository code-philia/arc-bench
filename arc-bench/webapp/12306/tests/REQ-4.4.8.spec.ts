import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.8
// fixtures: passenger_manager_user

test('REQ-4.4.8: Confirm deletion of one passenger', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('row', { name: /Delete Passenger Confirm/ }).getByRole('button', { name: 'Delete', exact: true }).click();
  await h.expectDialog(page, 'Are you sure you want to delete this passenger?');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await h.expectSuccessFeedback(page);
  await expect(page.getByRole('cell', { name: 'Delete Passenger Confirm' })).toHaveCount(0);
});

test('REQ-4.4.8: Cancel deletion of one passenger', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('row', { name: /Delete Passenger One/ }).getByRole('button', { name: 'Delete', exact: true }).click();
  await h.expectDialog(page, 'Are you sure you want to delete this passenger?');
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click();
  await h.expectTextsVisible(page, ['Delete Passenger One']);
});
