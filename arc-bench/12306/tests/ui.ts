import { expect, type Locator, type Page } from '@playwright/test';

type Surface = Page | Locator;
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function button(surface: Surface, name: string | RegExp) {
    return surface.getByRole('button', { name, exact: true }).filter({ visible: true });
}

export function link(surface: Surface, name: string | RegExp) {
    return navigationEntries(surface, name);
}

export function navigationEntries(surface: Surface, name?: string | RegExp) {
    return surface.getByRole('link', { name, exact: true })
        .or(surface.getByRole('button', { name, exact: true })).filter({ visible: true });
}

export function heading(surface: Surface, name: string | RegExp) {
    return surface.getByRole('heading', { name, exact: true }).filter({ visible: true });
}

export function region(surface: Surface, name: string) {
    const scope = 'page' in surface ? surface : surface.locator('html');
    const page = scope.page();
    const named = page.getByRole('region', { name, exact: true }).filter({ visible: true });
    const title = heading(page, new RegExp(`^${escape(name)}:?$`, 'i'));
    const titled = page.locator('section, aside, fieldset').filter({ has: title, visible: true });
    // Recheck the priority on every locator evaluation so it follows page updates.
    const fallback = scope.filter({ hasNot: named }).locator(titled).filter({ hasNot: titled });
    return scope.locator(named).or(fallback);
}

export function dialog(surface: Surface, title: string | RegExp) {
    const page = 'page' in surface ? surface.page() : surface;
    return surface.getByRole('dialog', { name: title, exact: true })
        .or(surface.getByRole('dialog').filter({ has: heading(page, title) }))
        .filter({ visible: true });
}

export function field(surface: Surface, name: string, ...aliases: string[]) {
    const labels = [name, ...aliases].map(value => escape(value.replace(/[:.]$/, '')));
    const label = new RegExp(`^\\s*\\*?\\s*(?:${labels.join('|')})[:.]?\\s*\\*?\\s*$`, 'i');
    const roles = ['textbox', 'combobox', 'spinbutton', 'searchbox'] as const;
    const controls = roles.map(role => surface.getByRole(role)).reduce((left, right) => left.or(right))
        .or(surface.locator('input[type=password], input[type=date]'));
    const byName = roles.map(role => surface.getByRole(role, { name: label })).reduce((left, right) => left.or(right));
    const labelled = surface.getByLabel(label).or(surface.getByPlaceholder(label)).and(controls);
    return labelled.or(byName).filter({ visible: true });
}

export function loginFields(surface: Surface) {
    const page = 'page' in surface ? surface.page() : surface;
    const accountField = (scope: Surface) => field(scope, 'Email/Username/Mobile number', 'Account', 'Username, email or mobile number');
    const account = accountField(page);
    const password = field(page, 'Password');
    const form = page.locator('form, [role=form]').filter({ has: account }).filter({ has: password });
    const standalone = page.getByRole('main').or(page.getByRole('dialog')).filter({ has: account })
        .filter({ has: password, hasNot: form });
    const scope = form.or(standalone);
    return {
        account: accountField(surface).and(accountField(scope)),
        password: field(surface, 'Password').and(field(scope, 'Password')),
        submit: button(surface, /^login$/i).and(button(scope, /^login$/i)),
    };
}

export function row(surface: Surface, identity: string) {
    const page = 'page' in surface ? surface.page() : surface;
    return surface.getByRole('row').filter({ has: page.getByText(identity, { exact: true }), visible: true });
}

export const tab = (surface: Surface, name: string) => surface.getByRole('tab', { name, exact: true })
    .or(link(surface, name).and(surface.locator('[aria-current], [aria-pressed], [aria-controls]')))
    .filter({ visible: true });

export function selectedTab(surface: Surface, name?: string) {
    const selected = surface.getByRole('tab', { name, exact: true, selected: true });
    const current = surface.locator('[aria-current="page"], [aria-current="true"], [aria-pressed="true"]');
    const alternative = name ? link(surface, name).and(current) : surface.locator('[aria-controls]').and(current);
    return selected.or(alternative).filter({ visible: true });
}

export function guidePanel(surface: Surface, name: string) {
    return surface.getByRole('tabpanel', { name, exact: true }).or(region(surface, name)).filter({ visible: true });
}

export function picture(surface: Surface, name: string | RegExp) {
    const keywords = typeof name === 'string' ? new RegExp('\\b' + escape(name) + '\\b', 'i') : name;
    return surface.getByRole('img', { name: keywords })
        .or(surface.getByRole('figure', { name: keywords }).locator('img, svg'))
        .filter({ visible: true });
}

export function statusMessage(surface: Surface, value: string) {
    const matchingMessages = (scope: Surface) => scope.getByRole('status').or(scope.getByRole('alert'))
        .or(scope.locator('[aria-live]:not([aria-live=off])')).filter({ hasText: value, visible: true });
    const page = 'page' in surface ? surface.page() : surface;
    return matchingMessages(surface).filter({ hasNot: matchingMessages(page) });
}

export async function selectChoice(control: Locator, label: string | RegExp) {
    if (await control.evaluate(element => element instanceof HTMLSelectElement)) {
        if (typeof label === 'string') {
            await control.selectOption({ label });
        } else {
            let matchingLabels: string[] = [];
            await expect.poll(async () => {
                const labels = await control.evaluate(element =>
                    Array.from((element as HTMLSelectElement).options, option => option.label));
                matchingLabels = labels.filter(text => text.trim().search(label) !== -1);
                return matchingLabels.length;
            }, { message: 'Expected one option matching ' + label }).toBe(1);
            await control.selectOption({ label: matchingLabels[0] });
        }
        return;
    }
    await control.click();
    const listId = await control.getAttribute('aria-controls');
    if (!listId) throw new Error(`Choice control must identify its open options for ${label}`);
    const list = control.page().locator(`[id=${JSON.stringify(listId)}]`).getByRole('option', { name: label, exact: true });
    await list.click();
}

export async function chooseFilter(surface: Surface, name: string, label: string) {
    const dropdown = field(surface, name);
    const group = surface.getByRole('group', { name, exact: true });
    const choice = group.getByRole('checkbox', { name: label, exact: true })
        .or(group.getByRole('radio', { name: label, exact: true })).filter({ visible: true });
    await expect(dropdown.or(choice)).toBeVisible();
    if (await dropdown.isVisible()) await selectChoice(dropdown, label);
    else await choice.check();
}

export async function expectChoice(control: Locator, label: string) {
    await expect.poll(() => control.evaluate(element => {
        if (element instanceof HTMLSelectElement) return element.selectedOptions[0]?.textContent?.trim();
        if (element instanceof HTMLInputElement) return element.value;
        return element.textContent?.trim();
    })).toBe(label);
}

export async function openMenu(trigger: Locator, destination: Locator) {
    await trigger.hover();
    if (!await destination.isVisible() && await trigger.getAttribute('aria-expanded') === 'false') {
        await trigger.click();
    }
    await expect(destination).toBeVisible();
}
