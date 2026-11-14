// requirement: REQ-3.7
import { test } from './fixtures/test';
import { defaultResults, entry, link, openMenu } from './helpers';
test("REQ-3.7: Open Tickets quick entry", async ({ page }) => {
    await entry(page);
    await openMenu(link(page.getByRole('navigation'), 'Booking'), link(page, 'Tickets'));
    await link(page, 'Tickets').click();
    await defaultResults(page);
});
