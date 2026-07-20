import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.1
// fixtures: searchable_routes

test('REQ-5.1.1: Show the quick login form for an unauthenticated booking attempt', async ({ page }) => {
  await h.openBookingForm(page, false);
  await h.expectTextsVisible(page, ['Login', 'Email/Username/Mobile number', 'Password', 'LOGIN']);
});
