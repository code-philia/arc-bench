import { createHash, randomBytes } from 'node:crypto';
import type { TestInfo } from '@playwright/test';

const runId = randomBytes(8).toString('hex');

export function identity(info: TestInfo, example: string): string {
  const caseId = createHash('sha256').update(info.title).digest('hex').slice(0, 10);
  // Hex-only suffixes cannot accidentally match the keyword "st".
  return `${example} [${runId}-w${info.workerIndex}-${caseId}]`;
}
