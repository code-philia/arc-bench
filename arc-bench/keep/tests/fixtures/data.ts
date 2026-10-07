import { createHash } from 'node:crypto';
import type { TestInfo } from '@playwright/test';

export const benchmarkNow = '2026-07-21T12:00:00.000Z';
export const history = {
  expired: { title: 'Expired seven-day note', content: 'Historical expired content' },
  recent: { title: 'Recent six-day note', content: 'Historical retained content' },
} as const;

export function identity(info: TestInfo, example: string): string {
  const run = process.env.KEEP_RUN_ID;
  if (!run) throw new Error('KEEP_RUN_ID must be supplied by the evaluator');
  const caseId = createHash('sha256').update(info.title).digest('hex').slice(0, 10);
  // Hex-only suffixes cannot accidentally match the keyword "st".
  const runId = createHash('sha256').update(run).digest('hex').slice(0, 10);
  return `${example} [${runId}-w${info.workerIndex}-${caseId}]`;
}
