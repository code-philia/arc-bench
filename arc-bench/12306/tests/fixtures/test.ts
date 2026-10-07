import { test as base } from '@playwright/test';
import { createHash } from 'node:crypto';
export function caseKey(title: string) {
    const readable = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // A DNS label is limited to 63 bytes. The digest also prevents truncation collisions.
    return readable.slice(0, 40).replace(/-$/g, '') + '-' + createHash('sha256').update(title).digest('hex').slice(0, 12);
}
export const test = base.extend({
    baseURL: async ({}, use, info) => {
        const template = process.env.RAIL_BASE_URL_TEMPLATE;
        const run = process.env.RAIL_RUN_ID;
        if (!template) {
            // Local runs can target one app URL; formal isolation may supply a per-case template.
            const url = process.env.PLAYWRIGHT_BASE_URL ?? info.project.use.baseURL;
            if (!url) throw new Error('Configure the application baseURL or RAIL_BASE_URL_TEMPLATE.');
            await use(url);
            return;
        }
        if (!template.includes('{case}') || !run)
            throw new Error('Per-case evaluation requires {case} in RAIL_BASE_URL_TEMPLATE and RAIL_RUN_ID.');
        const url = template.replaceAll('{case}', caseKey(info.title)).replaceAll('{run}', encodeURIComponent(run));
        const target = new URL(url);
        if (target.pathname !== '/' || target.search || target.hash)
            throw new Error('Per-case targets must be distinct origins; entry navigation is /.');
        await use(target.origin);
    },
});
