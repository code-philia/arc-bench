import { expect, type Page, type Locator } from '@playwright/test';
export { PASS, trains, plans } from './fixtures/data';
import { PASS, trains, plans } from './fixtures/data';
import { defaultTrain, newAccount, newPassenger, verifiedLogin, type Account, type BookingAccount, type Passenger } from './fixtures/data';
import { afterTest, travelDate } from './fixtures/test';
import { button, link, field, region, row, heading, dialog, tab as categoryTab, selectedTab, guidePanel, loginFields, selectChoice, expectChoice, openMenu } from './ui';
export * from './ui';
type Surface = Page | Locator;
export const AGREEMENT = 'I have read and agree to abide by Terms of Service and Privacy Policy of 12306.cn.';
export const registerEntry = /^(?:No account yet\?\s*)?Register now[.!]?$/i;
export const recoveryEntry = /^Forgot (?:your )?password\??$/i;
export const registerSubmit = (page: Page) => {
    const name = /^(Register|Next step)$/i;
    const form = page.locator('form').filter({ has: field(page, 'Username') });
    return button(form, name).or(button(page, name).and(
        page.locator('main button, main [role=button], input[type=submit], button[type=submit]'),
    ));
};
export async function openAgreement(page: Page, name: string) {
    const registration = page.locator('form').filter({ has: field(page, 'Username') });
    const inForm = link(registration, name);
    if (await inForm.isVisible()) {
        await inForm.click();
        return;
    }
    const candidates = link(page, name);
    await expect.poll(() => candidates.count()).toBeGreaterThan(0);
    const destinations = await candidates.evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    if (destinations.length > 1 && destinations[0] && new Set(destinations).size === 1) {
        await candidates.first().click();
        return;
    }
    await candidates.click();
}
export async function text(page: Page, value: string, exact = true) { await expect(page.getByText(value, { exact })).toBeVisible(); }
export async function entry(page: Page) { await page.goto('/'); }
export async function home(page: Page) { await link(page.getByRole('navigation').filter({ has: link(page, 'Home') }), 'Home').click(); }
export async function login(page: Page, user = verifiedLogin.username, password: string = PASS, success = true) {
    await link(page, 'Login').click();
    const form = loginFields(page);
    await form.account.fill(user);
    await form.password.fill(password);
    await form.submit.click();
    if (success)
        await expect(link(page, 'Sign Out')).toBeVisible();
}

export async function register(page: Page, account: Account) {
    await link(page, 'Register').click();
    await expectChoice(field(page, 'Nationality'), 'Please select');
    await selectChoice(field(page, 'Nationality'), 'China');
    const values = {
        'Name': account.name, 'Passport number': account.passport, 'Passport expiration date': account.expiration,
        'Date of birth': account.birth, 'Username': account.username, 'Password': account.password,
        'Confirm Password': account.confirm, 'Email address': account.email,
    };
    for (const [label, value] of Object.entries(values))
        await field(page, label).fill(value);
    await page.getByRole('radio', { name: account.gender, exact: true }).check();
    if (account.agree)
        await page.getByRole('checkbox', { name: AGREEMENT, exact: true }).check();
    await registerSubmit(page).click();
}

export async function signOutIfSignedIn(page: Page) {
    await home(page);
    const signOut = link(page, 'Sign Out');
    if (await signOut.isVisible()) await signOut.click();
    await expect(link(page, 'Login')).toBeVisible();
}

export async function createAccount(page: Page, account = newAccount()) {
    await register(page, account);
    await text(page, 'Registration successful.');
    await signOutIfSignedIn(page);
    await login(page, account.username, account.password);
    return account;
}

export const centerMenu = (page: Page) => page.getByRole('navigation', { name: 'Personal center menu', exact: true })
    .or(page.getByRole('navigation').filter({ has: link(page, 'Order center'), hasNot: link(page, 'Home') }))
    .filter({ visible: true });
export async function center(page: Page) { await home(page); await link(page, 'My 12306').click(); await expect(centerMenu(page)).toBeVisible(); }

export async function quickEntries(page: Page) {
    const trigger = link(page, 'My 12306');
    await expect(trigger).toBeVisible();
    const menuId = await trigger.getAttribute('aria-controls');
    const named = region(page, 'My 12306 quick entries');
    const menu = menuId ? page.locator(`[id=${JSON.stringify(menuId)}]`).filter({ visible: true }) : named;
    await openMenu(trigger, menu);
    return menu;
}
export async function section(page: Page, parent: string, child: string) {
    await center(page);
    const menu = centerMenu(page);
    const destination = link(menu, child);
    if (!await destination.isVisible()) await link(menu, parent).click();
    await destination.click();
}
export async function orders(page: Page, tab: string) { await section(page, 'Order center', 'Ticket orders'); await categoryTab(page, tab).click(); await expect(selectedTab(page, tab)).toBeVisible(); }

export const guideCategories = ['Ticketing', 'Endorsement and refund', 'Miscellaneous'];

export async function selectedGuidePanel(page: Page) {
    const active = selectedTab(page);
    await expect(active).toHaveCount(1);
    for (const category of guideCategories) {
        if (await selectedTab(page, category).isVisible()) {
            const panel = guidePanel(page, category);
            await expect(panel).toBeVisible();
            return panel;
        }
    }
    throw new Error('No travel guide category is selected');
}
export function stationOption(page: Page, name: string) {
    const bilingual = name.replace(' (', '(');
    return button(page, name).or(button(page, bilingual))
        .or(page.getByRole('option', { name, exact: true }))
        .or(page.getByRole('option', { name: bilingual, exact: true })).filter({ visible: true });
}

export async function chooseDepartureDate(page: Page, date: string) {
    const input = field(page, 'Date');
    await expect(input).toBeVisible();
    if (await input.getAttribute('type') === 'date') {
        await input.fill(date);
    } else {
        await input.click();
        await dateChoice(page, date).click();
    }
    await expect(input).toHaveValue(date);
}

export function dateChoice(surface: Surface, date: string) {
    const local = new Date(`${date}T00:00:00Z`);
    const long = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
    }).format(local);
    return link(surface, date).or(link(surface, long))
        .or(surface.locator(`[data-date="${date}"]`).and(surface.getByRole('button').or(surface.getByRole('link'))))
        .filter({ visible: true });
}

export async function search(page: Page, from = 'Shanghai', to = 'Beijing', date = travelDate(page), omit = '') {
    const places: Record<string, [
        string,
        string
    ]> = { Shanghai: ['shang', 'Shanghai (上海)'], Beijing: ['bei', 'Beijing (北京)'], Yancheng: ['yan', 'Yancheng (盐城)'], Lhasa: ['lhasa', 'Lhasa (拉萨)'] };
    for (const [label, value] of [['From', from], ['To', to]]) {
        const input = field(page, label);
        if (omit === label) {
            await input.fill('');
            continue;
        }
        await input.fill(places[value][0]);
        await stationOption(page, places[value][1]).click();
    }
    await chooseDepartureDate(page, date);
    await button(page, 'Search').click();
    if (!omit)
        await expect(field(page, 'Date')).toHaveValue(date);
}
export async function defaultResults(page: Page) {
    await expect(field(page, 'From')).toHaveValue('Beijing');
    await expect(field(page, 'To')).toHaveValue('Shanghai');
    await expect(field(page, 'Date')).toHaveValue(travelDate(page));
    await expect(row(page, defaultTrain)).toBeVisible();
}
export async function checkHeaders(s: Surface, names: string[]) {
    for (const name of names)
        await expect(s.getByRole('columnheader', { name, exact: true })).toBeVisible();
}
export async function trainIds(page: Page) {
    const trainNumber = page.getByText(/^[GCDKZT]\d+$/, { exact: true });
    const rows = await page.getByRole('row').filter({ has: trainNumber, visible: true }).all();
    const result: string[] = [];
    for (const r of rows) {
        const cells = await r.getByRole('cell').allTextContents();
        const ids = [...new Set(cells.flatMap(s => s.match(/\b[GCDKZT]\d+\b/g) ?? []))];
        if (ids.length !== 1)
            throw new Error('Train result needs one distinct train identity in its cells');
        result.push(ids[0]);
    }
    return result;
}
export async function expectTrainIds(page: Page, ids: string[]) { await expect.poll(async () => (await trainIds(page)).sort()).toEqual([...ids].sort()); }

export async function expectSecondClassFare(train: Locator, price: number) {
    const label = 'Second-class seat';
    const fare = new RegExp(`\\b${label}\\s*[:(]?\\s*(?:CNY|[¥￥])\\s*${price}(?:\\.0{1,2})?(?![\\d.])`, 'i');
    await expect(train).toContainText(fare, { useInnerText: true });
}
export async function sortTrains(page: Page, label: string, key: 'departure' | 'duration' | 'arrival') {
    const ordered = [...trains].sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en', { numeric: true })).map(t => t.number);
    const column = page.getByRole('columnheader', { name: label, exact: true });
    const nested = link(column, label);
    const sort = nested.or(column.and(page.locator('[aria-sort], [tabindex]')).filter({ hasNot: link(page, label) }));
    await sort.click();
    await expect.poll(() => trainIds(page)).toEqual(ordered);
    await sort.click();
    await expect.poll(() => trainIds(page)).toEqual([...ordered].reverse());
}
export const planEntries = (page: Page) => {
    const scope = region(page, 'Transfer plans');
    return scope.getByRole('article').or(scope.getByRole('listitem'))
        .filter({ has: page.getByText(/^D\d+$/, { exact: true }), visible: true });
};

export const planEntry = (page: Page, firstTrain: string) => planEntries(page)
    .filter({ has: page.getByText(firstTrain, { exact: true }) });

export async function planIds(page: Page) {
    const articles = await planEntries(page).all();
    const result: string[] = [];
    for (const article of articles) {
        // A plan may repeat its first train number in a heading and details.
        // Compare business identities, not the number of text elements.
        const numbers = new Set((await article.getByText(/^D\d+$/, { exact: true })
            .allTextContents()).map(value => value.trim()));
        if (numbers.size !== 1)
            throw new Error('Transfer plan needs one distinct first train identity');
        result.push(...numbers);
    }
    return result;
}
export async function sortPlans(page: Page, label: string, key: 'departure' | 'total' | 'arrival') {
    const ordered = [...plans].sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en', { numeric: true })).map(p => p.first);
    const sort = link(region(page, 'Transfer plans'), label);
    await sort.click();
    await expect.poll(() => planIds(page)).toEqual(ordered);
    await sort.click();
    await expect.poll(() => planIds(page)).toEqual([...ordered].reverse());
}
export async function passengerPage(page: Page) { await section(page, 'Information management', 'My Passengers'); }
export const passengerForm = (page: Page) => dialog(page, 'Add new passengers')
    .or(region(page, 'Essential information')).filter({ visible: true, has: field(page, 'Passenger type') });

export async function addPassenger(page: Page, passenger: Passenger, success = true) {
    await button(page, 'Add new passengers').click();
    const form = passengerForm(page);
    await selectChoice(field(form, 'Nationality'), 'China');
    const values = {
        'Name': passenger.name, 'Passport number': passenger.passport, 'Passport expiration date': passenger.expiration,
        'Date of birth': passenger.birth, 'Email address': passenger.email, 'Mobile number': passenger.mobile,
    };
    for (const [label, value] of Object.entries(values))
        await field(form, label).fill(value);
    await form.getByRole('radio', { name: passenger.gender, exact: true }).check();
    await selectChoice(field(form, 'Passenger type'), 'Adult');
    await button(form, /^(Determine|Confirm)$/).click();
    if (success) {
        await expect(form).not.toBeVisible();
        await expect(row(page, passenger.passport)).toContainText(passenger.name);
    }
}

export async function manager(page: Page) {
    const account = await createAccount(page);
    await passengerPage(page);
    return account;
}

export type Journey = { train: string; date: string; passenger: Passenger; state: 'booking' | 'unpaid' | 'paid' | 'closed' };
export const confirmationDialog = (page: Page) => dialog(page, 'Please confirm the following information.');
export const bookingPassengers = (page: Page) => page.getByRole('table', { name: 'Booking passengers', exact: true })
    .or(page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: 'Ticket class', exact: true }) }));
export const payAction = (surface: Surface) => button(surface, /^Pay(?:\s*\(\s*\d{1,2}:\d{2}\s*\))?$/);

export function orderRow(page: Page, journey: Journey) {
    return row(page, journey.train).filter({ has: page.getByText(journey.passenger.name, { exact: true }) });
}

export async function booking(page: Page, user: BookingAccount, date = travelDate(page, 1), train: string = trains[0].number, existing?: Journey) {
    const journey: Journey = existing ?? { train, date, passenger: newPassenger(), state: 'booking' };
    if (!existing) {
        await login(page, user);
        await passengerPage(page);
        await addPassenger(page, journey.passenger);
    }
    await home(page);
    await search(page, 'Shanghai', 'Beijing', journey.date);
    await button(row(page, journey.train), 'Book').click();
    await expect(heading(page, /^Train Information:?$/i)).toBeVisible();
    return journey;
}

export async function selectPassenger(page: Page, passenger: Passenger) {
    const checkbox = page.getByRole('checkbox', { name: passenger.name, exact: true }).filter({ visible: true });
    const toggle = button(page, passenger.name).and(page.locator('[aria-pressed]'));
    await expect(checkbox.or(toggle)).toBeVisible();
    if (await checkbox.isVisible()) {
        await checkbox.check();
    } else {
        if (await toggle.getAttribute('aria-pressed') === 'false') await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    }
    const selected = row(bookingPassengers(page), passenger.passport);
    await expect(selected).toContainText(passenger.name);
    return selected;
}

export async function confirmation(page: Page, user: BookingAccount, date?: string, train?: string, existing?: Journey) {
    const journey = await booking(page, user, date, train, existing);
    const selected = await selectPassenger(page, journey.passenger);
    await selectChoice(field(selected, 'Ticket class'), 'Business-class seat');
    await button(page, 'Place order').click();
    await expect(confirmationDialog(page)).toContainText(journey.passenger.name);
    await expect(confirmationDialog(page)).toContainText(journey.train);
    return journey;
}

export async function payment(page: Page, user: BookingAccount, date?: string, train?: string) {
    const journey = await confirmation(page, user, date, train);
    await submitOrder(page, journey);
    return journey;
}

export async function submitOrder(page: Page, journey: Journey) {
    await button(confirmationDialog(page), 'Confirm').click();
    journey.state = 'unpaid';
    afterTest(page, () => restoreOrderAvailability(page, journey));
    const details = region(page, 'Order details');
    await expect(details).toContainText(journey.train);
    await expect(details).toContainText(journey.passenger.name);
}

export async function payOrder(page: Page, journey: Journey) {
    await payAction(page).click();
    journey.state = 'paid';
    await text(page, 'Payment successful.');
}

export async function orderSetup(page: Page, user: BookingAccount, date?: string, paid = false, train?: string) {
    const journey = await payment(page, user, date, train);
    if (paid) await payOrder(page, journey);
    return journey;
}

async function restoreOrderAvailability(page: Page, journey: Journey) {
    if (journey.state === 'closed') return;
    const paid = journey.state === 'paid';
    await orders(page, paid ? 'Upcoming trips' : 'Uncompleted orders');
    if (paid) {
        await button(orderRow(page, journey), 'Refund').click();
        await button(page, 'Confirm refund').click();
        await expect(page.getByText('Refund successful', { exact: false })).toBeVisible();
    } else {
        await button(orderRow(page, journey), 'Cancel').click();
        await button(dialog(page, 'Are you sure you want to cancel this order?'), 'Confirm').click();
        await expect(orderRow(page, journey)).toContainText('Cancelled');
    }
}

export const orderKeyword = (page: Page) => field(page, 'Order number/train number/name', 'Order search', 'Order keyword');
export const passengerKeyword = (page: Page) => field(page, 'Please enter passenger name', 'Passenger search', 'Passenger name or ID number');

export async function fillDates(page: Page, start: string, end: string, keyword = '') {
    await selectChoice(field(page, 'Order date type'), 'Search by departure date');
    await field(page, 'Start date').fill(start);
    await field(page, 'End date').fill(end);
    await orderKeyword(page).fill(keyword);
    await button(page, 'Search').click();
}
export async function recover(page: Page, email: string, passport: string, success = true) {
    await link(page, 'Login').click();
    await link(page, recoveryEntry).click();
    await field(page, 'Email:').fill(email);
    await field(page, 'ID number:').fill(passport);
    await button(page, /^submit$/i).click();
    if (success)
        await expect(field(page, 'New password:')).toBeVisible();
}
export async function security(page: Page, kind: 'password' | 'mailbox') {
    await section(page, 'Personal', 'Account security');
    const password = link(page, 'Login password');
    const passwordEdit = button(region(page, 'Login password'), 'Edit');
    await expect(password.or(passwordEdit)).toBeVisible();
    await expect(region(page, 'Security mailbox')).toBeVisible();
    await expect(region(page, 'Mobile number')).toBeVisible();
    if (kind === 'password')
        await password.or(passwordEdit).click();
    else
        await button(region(page, 'Security mailbox'), 'Edit').click();
}
