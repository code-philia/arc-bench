// requirement: REQ-4.2.1
import { test } from './fixtures/test';
import { entry, search, sortPlans } from './helpers';
test("REQ-4.2.1: Toggle transfer Departure Time", async ({ page }) => {
    await entry(page);
    await search(page, 'Yancheng', 'Lhasa');
    await sortPlans(page, "Departure Time", "departure");
});
