import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.4
// fixtures: profile_user

test('REQ-4.3.4: Save a new passenger type in the additional information section', async ({ page }) => {
  await h.openUserInformation(page);
  const section = page.getByRole('region', { name: 'Additional information' });
  await section.getByRole('button', { name: 'Edit', exact: true }).click();
  await section.getByLabel('Passenger type').selectOption({ label: 'Child' });
  await section.getByRole('button', { name: 'Save', exact: true }).click();
  await h.expectTextsVisible(page, ['Child']);
});
