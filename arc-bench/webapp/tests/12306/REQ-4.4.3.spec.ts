import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.3
// fixtures: passenger_manager_user

test('REQ-4.4.3: Add a frequent passenger successfully', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.selectOption(page, 'Nationality', h.FIXTURES.passenger.nationality);
  await h.fillField(page, 'Name', h.FIXTURES.passenger.name);
  await h.fillField(page, 'Passport number', h.FIXTURES.passenger.passportNumber);
  await h.fillField(page, 'Passport expiration date', h.FIXTURES.passenger.passportExpirationDate);
  await h.fillField(page, 'Date of birth', h.FIXTURES.passenger.birthDate);
  await h.selectRadio(page, h.FIXTURES.passenger.gender);
  await h.fillField(page, 'Email address', h.FIXTURES.passenger.email);
  await h.fillField(page, 'Mobile number', h.FIXTURES.passenger.mobile);
  await h.selectOption(page, 'Passenger type', h.FIXTURES.passenger.passengerType);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});
