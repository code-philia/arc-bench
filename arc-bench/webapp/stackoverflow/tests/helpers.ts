
import { expect, Locator, Page } from '@playwright/test';

type Scope = Page | Locator;
type Match = string | RegExp | Array<string | RegExp>;

export type AccountFixture = {
  email: string;
  password: string;
  displayName: string;
};

export type QuestionFixture = {
  title: string;
};

export const FIXTURES = {
  auth: {
    email: 'stack_user@example.com',
    password: 'Password123!',
    invalidEmail: 'invalid-email-format',
    unknownEmail: 'unknown_user@example.com',
    wrongPassword: 'WrongPassword123!',
    signupEmail: 'new_stack_user@example.com',
    weakPasswordEmail: 'weak_password_candidate@example.com',
    weakPassword: 'short',
  },
  accounts: {
    readonly: {
      email: 'stack_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    activity: {
      email: 'activity_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    profileEditor: {
      email: 'profile_editor@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionCreator: {
      email: 'question_creator@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionEditor: {
      email: 'question_editor@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionDeleter: {
      email: 'question_deleter@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionUpvoter: {
      email: 'question_upvoter@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionDownvoter: {
      email: 'question_downvoter@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerSubmitter: {
      email: 'answer_submitter@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerVoter: {
      email: 'answer_voter@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerAcceptOwner: {
      email: 'answer_accept_owner@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerEditUser: {
      email: 'answer_edit_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerValidationUser: {
      email: 'answer_validation_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerDeleteUser: {
      email: 'answer_delete_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    questionCommentUser: {
      email: 'question_comment_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    commentEditUser: {
      email: 'comment_edit_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    commentDeleteUser: {
      email: 'comment_delete_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    commentVoteUser: {
      email: 'comment_vote_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    answerCommentUser: {
      email: 'answer_comment_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    commentReplyUser: {
      email: 'comment_reply_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    tagWatcher: {
      email: 'tag_watcher@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    filterUser: {
      email: 'filter_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
    badgeUser: {
      email: 'badge_user@example.com',
      password: 'Password123!',
      displayName: 'Stack User',
    },
  },
  profile: {
    displayName: 'Stack User',
    updatedDisplayName: 'Stack User Updated',
    fullName: 'Stack Overflow User',
    location: 'Shanghai',
    title: 'Backend Engineer',
    about: 'I enjoy building APIs and developer tooling for teams.',
    website: 'www.example.dev',
    github: 'github.com/example',
  },
  question: {
    newTitle: 'How can I safely retry an idempotent HTTP request in Node.js without duplicating side effects?',
    shortTitle: 'Short title',
    body: 'I am building a Node.js service and need a safe retry pattern for idempotent HTTP requests. I have already tried a simple timeout wrapper, but I need guidance on exponential backoff, duplicate suppression, timeout handling, and observability across intermittent failures in production. What patterns should I use and how should I structure retries so the client remains correct, debuggable, and safe for repeated delivery attempts?',
    updatedBody: 'Updated question body that explains the current retry approach, failure modes, and what has already been tested in production environments.',
    summary: 'Clarified retry requirements and added implementation context.',
    tags: ['node.js', 'http', 'retry'],
  },
  questions: {
    detail: { title: 'How can I safely retry an idempotent HTTP request in Node.js?' },
    editPreview: { title: 'SO Question Edit Preview' },
    editSave: { title: 'SO Question Edit Save' },
    deletable: { title: 'SO Deletable Question' },
    upvote: { title: 'SO Upvote Question' },
    downvote: { title: 'SO Downvote Question' },
    answerSubmission: { title: 'SO Answer Submission Question' },
    answerVoting: { title: 'SO Answer Voting Question' },
    acceptedAnswer: { title: 'SO Accepted Answer Question' },
    answerSorting: { title: 'SO Answer Sorting Question' },
    successfulAnswerEdit: { title: 'SO Successful Answer Edit Question' },
    answerValidation: { title: 'SO Answer Validation Question' },
    answerDelete: { title: 'SO Answer Delete Question' },
    questionComment: { title: 'SO Question Comment Question' },
    expandedComments: { title: 'SO Expanded Comment Question' },
    commentVote: { title: 'SO Comment Vote Question' },
    commentReply: { title: 'SO Comment Reply Question' },
    commentEdit: { title: 'SO Comment Edit Question' },
    commentDelete: { title: 'SO Comment Delete Question' },
    answerComment: { title: 'SO Answer Comment Question' },
  },
  answer: {
    body: 'Use exponential backoff together with an idempotency key so duplicate requests can be safely retried without creating duplicate side effects in downstream services.',
    updatedBody: 'Updated answer body describing exponential backoff, retry budgets, and idempotency keys for safe network retries.',
    summary: 'Expanded answer with retry-budget and idempotency details.',
  },
  comment: {
    body: 'Can you share what you tried so far?',
    updatedBody: 'Updated comment clarifying the original reproduction steps.',
    reply: '@Helpful User I tried exponential backoff and a request identifier.',
  },
  tags: {
    primary: 'python',
    secondary: 'javascript',
  },
  search: {
    query: 'react state',
  },
  filters: {
    customName: 'Python unanswered filter',
  },
} as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPatterns(value: Match): RegExp[] {
  const items = Array.isArray(value) ? value : [value];
  return items.map((item) => item instanceof RegExp ? item : new RegExp(escapeRegExp(item).replace(/\s+/g, '\\s+'), 'i'));
}

function target(scope: Scope): any {
  return scope as any;
}

async function firstVisible(locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.isVisible({ timeout: 500 })) return candidate;
    } catch {
      // continue
    }
  }
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.count()) return candidate;
    } catch {
      // continue
    }
  }
  return locators[0].first();
}

function namedLocators(scope: Scope, pattern: RegExp): Locator[] {
  const t = target(scope);
  return [
    t.getByRole('button', { name: pattern }),
    t.getByRole('link', { name: pattern }),
    t.getByRole('menuitem', { name: pattern }),
    t.getByRole('tab', { name: pattern }),
    t.getByRole('checkbox', { name: pattern }),
    t.getByRole('radio', { name: pattern }),
    t.getByRole('option', { name: pattern }),
    t.getByRole('heading', { name: pattern }),
    t.getByLabel(pattern),
    t.getByPlaceholder(pattern),
    t.getByText(pattern),
  ];
}

async function resolveNamed(scope: Scope, value: Match): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible(namedLocators(scope, pattern));
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible(namedLocators(scope, patterns[0]));
}

async function resolveField(scope: Scope, value: Match): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible([
      target(scope).getByLabel(pattern),
      target(scope).getByPlaceholder(pattern),
      target(scope).getByRole('textbox', { name: pattern }),
      target(scope).getByRole('searchbox', { name: pattern }),
      target(scope).getByRole('combobox', { name: pattern }),
    ]);
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible([
    target(scope).getByRole('textbox'),
    target(scope).locator('textarea'),
  ]);
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function clickNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.click();
}

export async function clickFirstAvailable(scope: Scope, values: Match[]): Promise<void> {
  for (const value of values) {
    try {
      const locator = await resolveNamed(scope, value);
      if (await locator.isVisible({ timeout: 200 })) {
        await locator.click();
        return;
      }
    } catch {
      // continue
    }
  }
  await clickNamed(scope, values[0]);
}

export async function hoverNamed(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.hover();
}

export async function expectVisible(scope: Scope, value: Match): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await expect(locator).toBeVisible();
}

export async function expectTextsVisible(scope: Scope, values: Array<string | RegExp>): Promise<void> {
  for (const value of values) {
    await expectVisible(scope, value);
  }
}

export async function expectTextAbsent(scope: Scope, value: Match): Promise<void> {
  const patterns = toPatterns(value);
  await expect(target(scope).getByText(patterns[0])).toHaveCount(0);
}

async function targetCard(page: Page, selectors: string[]): Promise<Locator> {
  return firstVisible([
    ...selectors.map((selector) => page.locator(selector).first()),
    page.getByRole('article').first(),
  ]);
}

export async function clickAnswerAction(page: Page, value: Match): Promise<void> {
  const answer = await targetCard(page, [
    '[data-answer-id]',
    '[data-answer]',
    '.answer',
    '.answer-card',
    '.answer-item',
  ]);
  await clickFirstAvailable(answer, [value]);
}

export async function clickCommentAction(page: Page, value: Match): Promise<void> {
  const comment = await targetCard(page, [
    '[data-comment-id]',
    '[data-comment]',
    '.comment',
    '.comment-item',
    '.comment-card',
  ]);
  await clickFirstAvailable(comment, [value]);
}

export async function fillField(scope: Scope, labelOrPlaceholder: Match, value: string): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.fill(value);
}

export async function pressEnter(scope: Scope, labelOrPlaceholder: Match): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.press('Enter');
}

export async function setCheckbox(scope: Scope, value: Match, checked: boolean): Promise<void> {
  const locator = await resolveNamed(scope, value);
  try {
    if (checked) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  } catch {
    await locator.click();
  }
}

export async function chooseOption(scope: Scope, field: Match, option: Match): Promise<void> {
  const locator = await resolveField(scope, field);
  try {
    const label = Array.isArray(option) ? option.find((item) => typeof item === 'string') : option;
    if (typeof label === 'string') {
      await locator.selectOption({ label });
      return;
    }
  } catch {
    // continue
  }
  await locator.click();
  await clickNamed(scope, option);
}

export async function expectFieldValue(scope: Scope, field: Match, expected: Match): Promise<void> {
  const locator = await resolveField(scope, field);
  const value = await locator.inputValue();
  const patterns = toPatterns(expected);
  if (!patterns.some((pattern) => pattern.test(value))) {
    throw new Error(`Expected field value to match ${patterns.map((item) => item.source).join(', ')}, got ${value}`);
  }
}

export async function expectUrlIncludes(page: Page, pattern: RegExp): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

export async function expectHomepage(page: Page): Promise<void> {
  await expectTextsVisible(page, [/questions/i, /tags/i, /users/i, /search/i]);
}

export async function openLoginPage(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
}

export async function openSignupPage(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/^sign up$/i]]);
}

export async function login(page: Page, account: AccountFixture = FIXTURES.accounts.readonly): Promise<void> {
  await openLoginPage(page);
  await fillField(page, [/email/i], account.email);
  await fillField(page, [/password/i], account.password);
  await clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
}

export async function openProfile(page: Page, account: AccountFixture = FIXTURES.accounts.readonly): Promise<void> {
  await login(page, account);
  await clickFirstAvailable(page, [[/profile/i, new RegExp(escapeRegExp(account.displayName), 'i')]]);
}

export async function openQuestionList(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/^questions$/i]]);
}

export async function openQuestionDetail(page: Page, question: QuestionFixture = FIXTURES.questions.detail): Promise<void> {
  await openQuestionList(page);
  await clickFirstAvailable(page, [[question.title]]);
}

export async function openAskQuestion(page: Page, account: AccountFixture = FIXTURES.accounts.readonly): Promise<void> {
  await login(page, account);
  await clickFirstAvailable(page, [[/ask question/i]]);
}

export async function fillMarkdownBody(scope: Scope, value: string): Promise<void> {
  await fillField(scope, [/body/i, /markdown/i, /text/i], value);
}

export async function openQuestionEdit(page: Page, account: AccountFixture, question: QuestionFixture): Promise<void> {
  await login(page, account);
  await openQuestionDetail(page, question);
  await clickFirstAvailable(page, [[/^edit$/i]]);
}

export async function openAnswerEditor(page: Page, account: AccountFixture, question: QuestionFixture): Promise<void> {
  await login(page, account);
  await openQuestionDetail(page, question);
  await clickFirstAvailable(page, [[/your answer/i, /answer/i]]);
}

export async function openTagsPage(page: Page): Promise<void> {
  await openQuestionList(page);
  await clickFirstAvailable(page, [[/^tags$/i]]);
}

export async function openTagDetail(page: Page, tag: string = FIXTURES.tags.primary): Promise<void> {
  await openTagsPage(page);
  await clickFirstAvailable(page, [[tag]]);
}

export async function openActivityTab(page: Page, account: AccountFixture = FIXTURES.accounts.activity): Promise<void> {
  await openProfile(page, account);
  await clickFirstAvailable(page, [[/^activity$/i]]);
}
