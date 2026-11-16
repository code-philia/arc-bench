// requirement: REQ-5.1.3
import { test } from './fixtures/test';
import { center, createAccount, defaultResults, entry, link, region } from './helpers';
test("REQ-5.1.3: Book from personal notice", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await center(page);
    await link(region(page, 'Notice'), 'ticket booking').click();
    await defaultResults(page);
});
