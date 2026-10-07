// requirement: REQ-8.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, text, region, payment } from './helpers';
test("REQ-8.4: Show consistent payment and running countdown", async ({ page }) => {
    await entry(page);
    await payment(page, 'booking_payment_user');
    await text(page, 'Seats are locked, Time remained to complete your payment:', false);
    const d = region(page, 'Order details');
    for (const value of ['G1001', 'Passenger Example', 'P20269993', 'Business-class seat'])
        await expect(d).toContainText(value);
    await text(page, 'Total: ￥1870.00');
    const c = region(page, 'Payment countdown');
    await expect(c).toHaveText(/^\d{2}:\d{2}$/);
    const seconds = (s: string) => { const [m, v] = s.trim().split(':').map(Number); expect(v).toBeLessThan(60); return m * 60 + v; };
    const initial = seconds(await c.innerText());
    expect(initial).toBeGreaterThanOrEqual(1180);
    expect(initial).toBeLessThanOrEqual(1200);
    await expect.poll(async () => seconds(await c.innerText()), { timeout: 6000 }).toBeLessThan(initial);
    const before = seconds(await c.innerText());
    await page.reload();
    await expect(c).toHaveText(/^\d{2}:\d{2}$/);
    expect(seconds(await c.innerText())).toBeLessThanOrEqual(before);
});
