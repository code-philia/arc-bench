// requirement: REQ-7.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, login, passengerPage, checkHeaders } from './helpers';
test("REQ-7.1: Inspect passenger table and protected holder", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await checkHeaders(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
    await expect(button(row(page, 'passenger_manager_user'), 'Delete')).toHaveCount(0);
});
