import { expect, Locator, Page, TestInfo } from '@playwright/test';

export type VerifiedAccount = {
  username: string;
  email: string;
  password: string;
};

const SEEDED_PASSWORD = 'Valid-password-123!';

const SEEDED_ACCOUNTS: Record<string, string> = {
  LOGIN: 'alice-dev',
  LOGIN_EMAIL: 'alice-dev',
  SIGN_OUT: 'alice-dev',
  PASSWORD_CHANGE_SUCCESS: 'password-change-success',
  PASSWORD_CHANGE_INVALID_CURRENT: 'password-change-invalid',
  PASSWORD_CHANGE_REQUIRED: 'password-change-required',
  RECOVERY_VISIBILITY: 'recovery-visibility',
  RECOVERY_INVALID_CODE: 'recovery-invalid-code',
  RECOVERY_SUCCESS: 'recovery-success',
  ORGANIZATION_OWNER: 'org-owner',
  ORGANIZATION_NEW_MEMBER: 'new-member',
  ORGANIZATION_EXISTING_MEMBER: 'existing-member',
  ORGANIZATION_NON_OWNER: 'org-member',
  TEAM_MAINTAINER: 'team-maintainer',
  NON_ADMIN_COLLABORATOR: 'collaborator',
  REPOSITORY_OWNER: 'repo-owner',
  REPOSITORY_ADMIN: 'repo-admin',
  VISIBILITY_ADMIN: 'visibility-admin',
  FORK_USER: 'fork-user',
  BRANCH_CONTRIBUTOR: 'branch-contributor',
  DEFAULT_BRANCH_ADMIN: 'default-branch-admin',
  DEFAULT_BRANCH_NON_ADMIN: 'default-branch-viewer',
  FILE_CONTRIBUTOR: 'file-contributor',
  ISSUE_AUTHOR: 'issue-author',
  ISSUE_COMMENTER: 'issue-commenter',
  ISSUE_EDITOR: 'issue-editor',
  ISSUE_VIEWER: 'issue-viewer',
  PROTECTION_ADMIN: 'protection-admin',
  PROTECTION_NON_ADMIN: 'protection-viewer',
  PR_AUTHOR: 'pr-author',
  PR_CONTRIBUTOR: 'pr-contributor',
  PR_MAINTAINER: 'pr-maintainer',
  PR_REVIEWER: 'pr-reviewer',
  PR_VIEWER: 'pr-viewer',
  DRAFT_PR_AUTHOR: 'draft-author',
};

const SEEDED_EMAILS: Record<string, string> = {
  LOGIN: 'alice.dev@example.test',
  LOGIN_EMAIL: 'alice.dev@example.test',
  SIGN_OUT: 'alice.dev@example.test',
  PASSWORD_CHANGE_SUCCESS: 'password-change-success@example.test',
  PASSWORD_CHANGE_INVALID_CURRENT: 'password-change-invalid@example.test',
  PASSWORD_CHANGE_REQUIRED: 'password-change-required@example.test',
  RECOVERY_VISIBILITY: 'recovery-visibility@example.test',
  RECOVERY_INVALID_CODE: 'recovery-invalid-code@example.test',
  RECOVERY_SUCCESS: 'recovery-success@example.test',
};

/**
 * Some authorization scenarios require pre-existing roles. These credentials
 * are supplied as isolated browser-login fixtures, never through an API or a
 * persistence-store shortcut. Local registration itself needs no email flow.
 */
export function seedAccount(testInfo: TestInfo, prefix: string): VerifiedAccount {
  const key = prefix;
  const username = SEEDED_ACCOUNTS[key] ?? prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const email = SEEDED_EMAILS[key] ?? `${username}@example.test`;
  return { username, email, password: SEEDED_PASSWORD };
}

export function seedValue(_testInfo: TestInfo, name: string): string {
  const key = name;
  const values: Record<string, string> = {
    PUBLIC_REPOSITORY_NAME: 'acme-docs',
    VISIBILITY_REPOSITORY_NAME: 'visibility-demo',
    PUBLIC_ORGANIZATION_REPOSITORY: 'acme-docs',
    PRIVATE_REPOSITORY_NAME: 'secret-research',
    UNKNOWN_REPOSITORY_QUERY: 'no-such-repository',
    PRIVATE_ORGANIZATION_REPOSITORY: 'secret-research',
    EXISTING_ORGANIZATION: 'Acme Demo',
    EXISTING_ORGANIZATION_IDENTIFIER: 'acme-demo',
    EXISTING_OWNED_REPOSITORY: 'acme-docs',
    CODE_DIRECTORY: 'src',
    CODE_FILE_NAME: 'README.md',
    CODE_SEARCH_FILE: 'README.md',
    CODE_SEARCH_QUERY: 'search flow',
    CODE_SEARCH_EMPTY_QUERY: 'no-such-token',
    CODE_FILE_CONTENT: 'Document search flow',
    CHANGED_FILE: 'src/search.ts',
    PR_CHANGED_FILE: 'src/search.ts',
    TARGET_BRANCH_FILE: 'main-only.md',
    ACTIVE_BRANCH: 'main',
    TARGET_BRANCH: 'feature-search',
    UNKNOWN_BRANCH_QUERY: 'missing-branch',
    PR_BASE_BRANCH: 'main',
    PR_COMPARE_BRANCH: 'feature-search',
    DRAFT_PULL_REQUEST_SOURCE_BRANCH: 'draft-feature',
    DRAFT_PULL_REQUEST_TARGET_BRANCH: 'main',
    NEW_DEFAULT_BRANCH: 'release',
    OLD_DEFAULT_BRANCH: 'main',
    PROTECTED_BRANCH_PATTERN: 'main',
    COMMIT_MESSAGE: 'Document search flow',
    COMMIT_AUTHOR: 'alice-dev',
    OPEN_ISSUE_TITLE: 'Improve onboarding',
    CLOSED_ISSUE_TITLE: 'Legacy welcome text',
    ISSUE_TITLE: 'Improve onboarding',
    INVALID_EDIT_ISSUE_TITLE: 'Original issue title',
    ISSUE_DESCRIPTION: 'Describe the onboarding improvement.',
    ISSUE_LABEL: 'bug',
    ISSUE_MILESTONE: 'v1.0',
    ISSUE_ASSIGNEE: 'bob-reviewer',
    OPEN_PULL_REQUEST_TITLE: 'Improve onboarding',
    PULL_REQUEST_TITLE: 'Overview onboarding PR',
    DRAFT_PULL_REQUEST_TITLE: 'Draft onboarding update',
    REQUESTED_REVIEWER: 'bob-reviewer',
    TEAM_CANDIDATE_USERNAME: 'bob-reviewer',
    ORGANIZATION_MEMBER_TO_REMOVE: 'existing-member',
    ORGANIZATION_MEMBER_FOR_NON_OWNER: 'protected-member',
    PASSWORD_CHANGE_NEW_PASSWORD: 'New-password-456!',
    PASSWORD_CHANGE_REQUIRED_NEW_PASSWORD: 'Required-password-789!',
    ACCESS_TEAM_NAME: 'frontend-team',
    ACCESS_ROLE_CHANGE_TEAM_NAME: 'access-role-team',
    FORK_SOURCE_REPOSITORY_NAME: 'acme-docs',
    EXISTING_FORK_NAME: 'acme-docs-fork',
    CYCLIC_TEAM_DESCENDANT: 'frontend-child',
    CYCLIC_TEAM_ORIGINAL_PARENT: 'platform-team',
    // Navigation targets are visible labels, never application URLs.
    PUBLIC_REPOSITORY_ENTRY: 'acme-docs',
    FORK_SOURCE_REPOSITORY_ENTRY: 'acme-docs',
    VISIBILITY_REPOSITORY_ENTRY: 'visibility-demo',
    CODE_REPOSITORY_ENTRY: 'acme-docs',
    BRANCH_REPOSITORY_ENTRY: 'branch-switch-demo',
    DEFAULT_BRANCH_REPOSITORY_ENTRY: 'default-branch-demo',
    FILE_REPOSITORY_ENTRY: 'file-management-demo',
    PROTECTION_REPOSITORY_ENTRY: 'branch-protection-demo',
    ISSUE_ENTRY: 'Improve onboarding',
    CLOSABLE_ISSUE_ENTRY: 'Closable onboarding issue',
    PROTECTED_ISSUE_ENTRY: 'Protected onboarding issue',
    COMMENTABLE_ISSUE_ENTRY: 'Commentable onboarding issue',
    COMMENT_VALIDATION_ISSUE_ENTRY: 'Comment validation issue',
    MILESTONE_ISSUE_ENTRY: 'Milestone onboarding issue',
    LABELABLE_ISSUE_ENTRY: 'Labelable onboarding issue',
    EDITABLE_ISSUE_ENTRY: 'Editable onboarding issue',
    INVALID_EDIT_ISSUE_ENTRY: 'Original issue title',
    ASSIGNABLE_ISSUE_ENTRY: 'Assignable onboarding issue',
    ISSUES_ENTRY: 'Issues',
    PULL_REQUESTS_ENTRY: 'Pull requests',
    PULL_REQUEST_ENTRY: 'Overview onboarding PR',
    PUBLIC_PULL_REQUEST_ENTRY: 'Public onboarding PR',
    REVIEWABLE_PULL_REQUEST_ENTRY: 'Reviewable onboarding PR',
    PENDING_REVIEW_PULL_REQUEST_ENTRY: 'Pending review onboarding PR',
    ASSIGNABLE_PULL_REQUEST_ENTRY: 'Reviewer request onboarding PR',
    MERGEABLE_PULL_REQUEST_ENTRY: 'Mergeable onboarding PR',
    UNMERGEABLE_PULL_REQUEST_ENTRY: 'Blocked onboarding PR',
    CLOSABLE_PULL_REQUEST_ENTRY: 'Closable onboarding PR',
    PROTECTED_PULL_REQUEST_ENTRY: 'Protected onboarding PR',
    CHANGE_REQUEST_PULL_REQUEST_ENTRY: 'Change request onboarding PR',
    PROTECTION_PULL_REQUEST_ENTRY: 'Protection status onboarding PR',
    DRAFT_PULL_REQUEST_ENTRY: 'Draft onboarding update',
    COMPARE_ENTRY: 'Compare',
    VALID_COMPARE_ENTRY: 'Compare',
    DRAFT_COMPARE_ENTRY: 'Compare',
    COMMIT_ENTRY: 'Document search flow',
  };
  return values[key] ?? `seed-${key.toLowerCase().replace(/^e2e_/, '').replace(/_/g, '-')}`;
}

export async function openVisibleOrganization(page: Page, name: string): Promise<void> {
  await clickVisibleTarget(page, name);
}

export async function openVisibleRepository(page: Page, name: string): Promise<void> {
  await clickVisibleTarget(page, name);
}

/**
 * Click a visible navigation target without assuming that the application
 * has already chosen the ideal HTML element.  Production implementations may
 * expose a target as a link, button, or clickable text while the behavior is
 * otherwise identical.
 */
export async function clickVisibleTarget(page: Page, name: string): Promise<void> {
  const candidates = [
    page.getByRole('link', { name, exact: true }).first(),
    page.getByRole('button', { name, exact: true }).first(),
    page.getByText(name, { exact: true }).first(),
  ];

  for (const candidate of candidates) {
    if ((await candidate.count()) > 0 && (await candidate.isVisible())) {
      await candidate.click();
      return;
    }
  }

  // Retry from the application entry point when the caller is on a page that
  // does not render the navigation target until it is opened from the root.
  await page.goto(baseUrl());
  const rootCandidates = [
    page.getByRole('link', { name, exact: true }).first(),
    page.getByRole('button', { name, exact: true }).first(),
    page.getByText(name, { exact: true }).first(),
  ];
  for (const candidate of rootCandidates) {
    if ((await candidate.count()) > 0 && (await candidate.isVisible())) {
      await candidate.click();
      return;
    }
  }

  throw new Error(`Could not find a visible navigation target named "${name}"`);
}

/** Resolve both semantic dialogs and legacy `.dialog` containers. */
export async function visibleDialog(page: Page, name: string): Promise<Locator> {
  const semanticDialog = page.getByRole('dialog', { name, exact: true }).first();
  if ((await semanticDialog.count()) > 0) {
    return semanticDialog;
  }

  const legacyDialog = page.locator('.dialog').filter({ hasText: name }).first();
  await expect(legacyDialog).toBeVisible();
  return legacyDialog;
}

/** Open a seeded object through whichever accessible/rendered target exists. */
export async function openVisibleTarget(page: Page, name: string): Promise<void> {
  await clickVisibleTarget(page, name);
}

export function baseUrl(): string {
  return process.env.BASE_URL ?? 'http://127.0.0.1:3000';
}

export async function openAccountAccess(page: Page): Promise<void> {
  await page.goto(baseUrl());
}

export async function signIn(page: Page, account: VerifiedAccount): Promise<void> {
  await openAccountAccess(page);
  const signInLink = page.getByRole('link', { name: 'Sign in', exact: true });
  await expect(signInLink).toHaveCount(1);
  await signInLink.click();
  await page.getByLabel('Username or email', { exact: true }).fill(account.username);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  // The signed-in username may be rendered both in the page heading and in
  // the account menu.  Use an exact match and assert against the first match
  // so Playwright does not enter strict-mode when both are present.
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
}

export function uniqueAccount(): VerifiedAccount {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const username = `pw-user-${suffix}`;

  return {
    username,
    email: `${username}@example.test`,
    password: 'Valid-password-123!',
  };
}

export async function openPasswordSettings(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await clickVisibleTarget(page, 'Settings');
  await clickVisibleTarget(page, 'Password and authentication');
}
