# Stack Overflow Platform

Web-based question and answer platform for developers that supports community knowledge sharing through asking, answering, searching, tagging, and reputation-driven participation.

## REQ-0 Open Homepage

Opening the platform root URL loads the homepage shell with a banner, main content, complementary sidebars, a navigation landmark named "Primary navigation" containing buttons named "Questions", "Tags", "Users", and "Badges", a textbox named "Search", and a central feed containing question articles.

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Enter Platform
  - **GIVEN:** User is in a web browser.
  - **WHEN:** Open the Stack Overflow platform root URL (/)
  - **THEN:** Display the homepage with header, sidebar navigation, and main question feed

## REQ-1 Homepage

![image](./reference/homepage.jpeg) The homepage is the default landing surface for question discovery and community navigation. It assembles the global header, left navigation, main question feed, and right sidebar widgets.

**Type:** FOLDER
**Dependencies:** None

### REQ-1.1 View Homepage Total Layout

Displays the multi-column homepage layout using a banner, main landmark, two complementary sidebars, heading "Newest Questions", and question articles.

**Type:** ATOMIC
**Dependencies:** REQ-0

**Scenarios:**

- View Homepage Layout
  - **GIVEN:** User is on the homepage.
  - **WHEN:** View the page layout
  - **THEN:** Display the multi-column homepage layout including header, sidebar, and main feed.

### REQ-1.2 Global Navigation Header

Fixed top bar for global navigation and utility. Includes the platform logo, search input with suggestions, the visible text "Products", and authentication status (Login/Sign up buttons or User Avatar/Stats).

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Global Navigation Header
  - **GIVEN:** User can see the global navigation header.
  - **WHEN:** View the top bar
  - **THEN:** The header shows the platform logo, search box, product links, and authentication or user-status controls.

### REQ-1.3 Sidebar Navigation

Left-hand navigation menu providing vertical access to major modules: Home, Questions, Tags, Users.

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Sidebar Navigation
  - **GIVEN:** User can see the left sidebar navigation.
  - **WHEN:** Click on navigation items
  - **THEN:** Highlight active section and navigate to corresponding page without full reload if applicable.

### REQ-1.4 Main Question Feed

The core content area displaying a list of recent or trending questions. Includes the "Ask Question" action, list filtering/sorting tabs (Newest, Active, and other supported sorts), and individual question summaries with engagement metrics (votes, answers, views). The public homepage and Questions page contain multiple public questions with titles, tags, vote counts, answer counts, and view counts; the feed remains populated if one independently mutable question is removed.

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Main Question Feed
  - **GIVEN:** User can see the main question feed.
  - **WHEN:** Scroll through the central feed
  - **THEN:** Display questions with titles, tags, and summary stats consistent with the design.

### REQ-1.5 Right Sidebar Widgets

Auxiliary information panel on the right side. Contains "The Overflow Blog", "meta items", "Hot Network Questions", and custom filters/tag watchlists.

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Right Sidebar Widgets
  - **GIVEN:** User can see the right sidebar area on the homepage.
  - **WHEN:** Check right-side content
  - **THEN:** Display featured blog posts and community-wide trending questions.

## REQ-2 User Authentication Module

Covers account creation, credential-based sign-in, session state, profile access, and privilege-gated interactions for authenticated features. Social and SSO login remain out of scope.

**Type:** FOLDER
**Dependencies:** REQ-1

### REQ-2.1 Anonymous Session

Shows "Log in" and "Sign up" entry points.

**Type:** ATOMIC
**Dependencies:** REQ-0

**Scenarios:**

- Anonymous Session
  - **GIVEN:** User is not logged in.
  - **WHEN:** View the global navigation header
  - **THEN:** Show "Log in" and "Sign up" entry points

### REQ-2.2 Authenticated Session

Shows user avatar/profile entry and authenticated navigation options. The system contains a verified account with email "stack_user@example.com", password "Password123!", and display name "Stack User" for stable authenticated read-only flows.

**Type:** ATOMIC
**Dependencies:** None

**Scenarios:**

- Authenticated Session
  - **GIVEN:** User is logged in.
  - **WHEN:** View the global navigation header
  - **THEN:** Show user avatar/profile entry and authenticated navigation options

### REQ-2.3 Elevated Privileges

Grants the additional actions and protected views that are available only to authorized users such as profile owners or moderators. The system contains a separate verified account with email "activity_user@example.com", password "Password123!", display name "Stack User", and permission to view reputation and activity data.

**Type:** ATOMIC
**Dependencies:** REQ-2.2

**Scenarios:**

- Elevated Privileges
  - **GIVEN:** User has elevated privileges (e.g., moderator or profile owner).
  - **WHEN:** Access privilege-gated pages or sections
  - **THEN:** Restricted information and actions are available

### REQ-2.4 User Login

Traditional email and password login interface. ![image](./reference/login.jpeg) Components: Stack Overflow Logo, Email Input, Password Input (with toggle/visibility and "Forgot password?" link), "Log in" submit button, and "Sign up" redirect link.

**Type:** FOLDER
**Dependencies:** None

#### REQ-2.4.1 Happy Path - Successful Login

Authenticates the user with a registered email and password, then returns the user to the homepage in a signed-in state.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Successful Login
  - **GIVEN:** User is on the homepage and is not logged in.
  - **WHEN:** Click "Log in" in the navigation bar
  - **THEN:** Display login form with email/password fields
  - **GIVEN:** Login form is visible.
  - **WHEN:** Enter registered email and correct password, click "Log in"
  - **THEN:** Authenticate user and redirect to homepage with logged-in status

#### REQ-2.4.2 Error - Empty Credentials

Displays validation errors "Email cannot be empty" and "Password cannot be empty".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Empty Credentials
  - **GIVEN:** Login form is visible.
  - **WHEN:** Click "Log in", leave email and password empty, click "Log in" button
  - **THEN:** Display validation errors "Email cannot be empty" and "Password cannot be empty"

#### REQ-2.4.3 Error - Invalid Email Format

Shows error message "The email is not a valid email address".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Invalid Email Format
  - **GIVEN:** Login form is visible.
  - **WHEN:** Enter "invalid-email-format", click "Log in"
  - **THEN:** Show error message "The email is not a valid email address"

#### REQ-2.4.4 Error - Unregistered Email

Entering the unregistered email "unknown_user@example.com" with password "Password123!" shows the error "No account found with this email".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Unregistered Email
  - **GIVEN:** Login form is visible.
  - **WHEN:** Enter an email not in the database, click "Log in"
  - **THEN:** Show error message "No account found with this email"

#### REQ-2.4.5 Error - Incorrect Password

Entering the registered email "stack_user@example.com" with the incorrect password "WrongPassword123!" shows the error "The email or password does not match any account".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Incorrect Password
  - **GIVEN:** Login form is visible.
  - **WHEN:** Enter valid email but wrong password, click "Log in"
  - **THEN:** Show error message "The email or password does not match any account"

### REQ-2.5 User Registration

Allows new users to create an account using email and password. ![image](./reference/sign-up.jpeg) Components: "Join Stack Overflow" header, Email Input, Password Input, Help text for password complexity, "Sign up" button, TOS/Privacy consent text, and "Log in" redirect link.

**Type:** FOLDER
**Dependencies:** None

#### REQ-2.5.1 Happy Path - Successful Sign up

Creates a new account with the unique email "new_stack_user@example.com" and valid password "Password123!", signs the user in automatically, and returns the user to the homepage.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Successful Sign Up
  - **GIVEN:** User is on the homepage or login page and is not logged in.
  - **WHEN:** Click "Sign up" in the navigation bar or "Sign up" link on login page
  - **THEN:** Display registration modal/page
  - **GIVEN:** Registration form is visible.
  - **WHEN:** Enter a unique email and valid password, click "Sign up"
  - **THEN:** Create user record, automatically log in, and redirect to homepage

#### REQ-2.5.2 Error - Email Already Registered

Shows error "Email is already in use".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Email Already Registered
  - **GIVEN:** Registration form is visible.
  - **WHEN:** Enter an already registered email address, click "Sign up"
  - **THEN:** Show error "Email is already in use"

#### REQ-2.5.3 Error - Weak Password

Entering the candidate email "weak_password_candidate@example.com" with weak password "short" shows the validation error "Password must be at least 8 characters and include a letter and a number".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Weak Password
  - **GIVEN:** Registration form is visible.
  - **WHEN:** Enter email and a password that doesn't meet safety criteria (e.g. too short)
  - **THEN:** Show validation error explaining password requirements (e.g. minimum 8 characters)

### REQ-2.6 View User Profile

Displays a comprehensive summary of a user's activity, reputation, and achievements. ![image](./reference/profile-page.jpeg)

**Type:** ATOMIC
**Dependencies:** REQ-2.2

**Scenarios:**

- View User Profile
  - **GIVEN:** User is logged in and can see the avatar or username in the header.
  - **WHEN:** Click user avatar or username in the top navigation bar header.
  - **THEN:** Redirect to the profile page, defaulting to the Activity -> Summary view  showing user stats and recent activity modules.

### REQ-2.7 Edit Profile Management

Allows users to customize their public identity and manage private details. ![image](./reference/edit-profile.jpeg) The system contains verified account "profile_editor@example.com" / "Password123!" with an editable public profile. The test updates Display name to "Stack User Updated", Location to "Shanghai", Title to "Backend Engineer", About me to "I enjoy building APIs and developer tooling for teams.", Website to "www.example.dev", and GitHub to "github.com/example", then uses "Save and copy changes to all public communities" and receives a success message.

**Type:** ATOMIC
**Dependencies:** REQ-2.6

**Scenarios:**

- Edit Profile Management
  - **GIVEN:** User is on their profile page.
  - **WHEN:** Click "Edit profile" button on the profile page
  - **THEN:** Display the "Edit your profile" form with all current information pre-filled.
  - **GIVEN:** The 'Edit your profile' form is visible.
  - **WHEN:** Modify Display name, Location, Title or "About me" (using Markdown editor)
  - **THEN:** Input fields reflect changes; editor provides real-time preview if applicable.
  - **WHEN:** Update social links (Website, X, GitHub) and Full name
  - **THEN:** Data validation for URL formats and length.
  - **WHEN:** Click "Save and copy changes to all public communities"
  - **THEN:** Profile is updated across the platform and a success message is displayed.

## REQ-3 Question Module

Core functionality for posting, viewing, editing, and managing questions. Questions include title, body, tags, vote count, view count, and answer count. ![image](./reference/questions-page.jpeg) The Questions page contains each dedicated question record below under a unique title and allows the corresponding account to open its detail page.

**Type:** FOLDER
**Dependencies:** REQ-2

### REQ-3.1 View Question List

Displays a paginated list of multiple public questions with titles, tags, vote counts, answer counts, and view counts. The list remains populated if one independently mutable question is removed.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- View Question List
  - **GIVEN:** User is on the homepage and can see the sidebar navigation.
  - **WHEN:** Navigate to Questions tab
  - **THEN:** Display paginated list of questions with metadata (votes, answers, views, tags)

### REQ-3.2 Ask Question

Authenticated users can post new questions with title, body (markdown/rich text editor), and tags. ![image](./reference/ask-question-page.jpeg) The system contains a separate verified account with email "question_creator@example.com" and password "Password123!" that can create questions.

**Type:** FOLDER
**Dependencies:** REQ-2

#### REQ-3.2.1 Create New Question

Lets verified account "question_creator_create@example.com" / "Password123!" publish a question titled "How can I safely retry an idempotent HTTP request in Node.js without duplicating side effects?" with body "I am building a Node.js service and need a safe retry pattern for idempotent HTTP requests. I have already tried a simple timeout wrapper, but I need guidance on exponential backoff, duplicate suppression, timeout handling, and observability across intermittent failures in production. What patterns should I use and how should I structure retries so the client remains correct, debuggable, and safe for repeated delivery attempts?" and tag "node.js". The tag suggestions include "node.js", "http", and "retry".

**Type:** ATOMIC
**Dependencies:** REQ-2.2

**Scenarios:**

- Create New Question
  - **GIVEN:** User is logged in.
  - **WHEN:** Click "Ask Question" button in navigation or homepage
  - **THEN:** Display question creation form
  - **GIVEN:** Question creation form is visible.
  - **WHEN:** Enter question title (minimum 15 characters)
  - **THEN:** Validate title length and show character count
  - **WHEN:** Enter question body using markdown editor (minimum 220 characters)
  - **THEN:** Display live markdown preview
  - **WHEN:** Add up to 5 relevant tags
  - **THEN:** Show tag suggestions based on input, validate tag count
  - **WHEN:** Click "Post Your Question"
  - **THEN:** Create question, redirect to question detail page, and show question in profile page under "Questions" tab

#### REQ-3.2.2 Validation for Required Fields

Blocks question submission until the title, body, and at least one tag satisfy the required validation rules. Seed data: isolated verified account "question_creator_validation@example.com" and isolated validation record.

**Type:** ATOMIC
**Dependencies:** REQ-2.2

**Scenarios:**

- Required Field Validation
  - **GIVEN:** User is logged in.
  - **WHEN:** Click "Ask Question" button
  - **THEN:** Display question creation form
  - **GIVEN:** Question creation form is visible.
  - **WHEN:** Leave title field empty and click "Post Your Question"
  - **THEN:** Show error message "Title is required (minimum 15 characters)", prevent submission
  - **WHEN:** Enter title but leave body empty and click "Post Your Question"
  - **THEN:** Show error message "Question body is required (minimum 220 characters)", prevent submission
  - **WHEN:** Enter title and body but add no tags and click "Post Your Question"
  - **THEN:** Show error message "Please add at least one tag", prevent submission

### REQ-3.3 Question Detail Page

A multi-faceted page that serves as the primary view for a specific question, its answers, and associated community interactions. ![image](./reference/question-page.jpeg) The public question "How can I safely retry an idempotent HTTP request in Node.js?" contains a rendered body about safe Node.js retries, the tags "node.js", "http", and "retry", valid Asked/Modified/Viewed metadata, an author card with avatar, reputation, and badges, and a visible interaction area.

**Type:** FOLDER
**Dependencies:** REQ-3

#### REQ-3.3.1 Default Question View

Displays the full hierarchical layout using a banner, main landmark, two complementary sidebars, the current question heading, and an answers heading.

**Type:** ATOMIC
**Dependencies:** REQ-3.1

**Scenarios:**

- Default Question View
  - **GIVEN:** A target question exists.
  - **WHEN:** Navigate to a specific question detail page
  - **THEN:** Display the full hierarchical layout including header, sidebar, body, and interaction sections.

#### REQ-3.3.2 Question Header and Metadata

Displays the question title prominently at the top, followed by metadata rows including "Asked" (date), "Modified" (last activity), and "Viewed" (count). Includes the "Ask Question" primary action button.

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Question Header and Metadata
  - **GIVEN:** User is on a question detail page.
  - **WHEN:** Look at the top section of the page
  - **THEN:** Title is clear; metadata shows accurate timestamps and view counts.

#### REQ-3.3.3 Post Voting and Interaction Sidebar

A vertical interaction area beside the question body contains buttons named "Upvote", "Downvote", "Save", and "Timeline", plus the current score.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Post Voting and Interaction Sidebar
  - **GIVEN:** User is on a question detail page.
  - **WHEN:** View the left margin of the question
  - **THEN:** Voting arrows and score are visible. Bookmark icon reflects saved status.

#### REQ-3.3.4 Main Post Content and Tags

The primary area for the question's body text (rendered Markdown). Followed by a list of associated tags (clickable buttons) and a menu of post actions (Share, Edit, Follow).

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Main Post Content and Tags
  - **GIVEN:** User is on a question detail page.
  - **WHEN:** Read the central content area
  - **THEN:** Body is formatted correctly; tags are displayed as distinct, navigable links.

#### REQ-3.3.5 Post Author and Ownership Card

A floating card at the bottom right of the question body showing the author's avatar, username, reputation, and badges. Displays the original posting timestamp.

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Post Author and Ownership Card
  - **GIVEN:** User is on a question detail page.
  - **WHEN:** Scroll to the bottom of the question body
  - **THEN:** Author's information is clearly attributed with current site stats.

#### REQ-3.3.6 Question Comments and Inline Interaction

A list of threaded comments located directly below the question and its tags. Includes functionality to "Add a comment" and expand hidden comments.

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Question Comments and Inline Interaction
  - **GIVEN:** User is on a question detail page.
  - **WHEN:** Look below the post-action menu
  - **THEN:** Comments are listed chronologically; "Add a comment" link is present for authenticated users.

### REQ-3.4 Edit Question

Allows authors and high-reputation users to refine questions. The edit interface mimics the Ask Question structure but includes revision history and modification tracking. ![image](./reference/edit-question.jpeg) The edit scenarios use isolated verified editor accounts and isolated editable questions.

**Type:** FOLDER
**Dependencies:** REQ-3.3

#### REQ-3.4.1 Enter Edit Mode

Displays the Edit Question page with all current content pre-populated in the respective fields. Seed data: verified account "question_editor_mode@example.com" and question "SO Question Edit Mode".

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Enter Edit Mode
  - **GIVEN:** User is on a question detail page and has permission to edit.
  - **WHEN:** Click "Edit" link below a question
  - **THEN:** Display the Edit Question page with all current content pre-populated in the respective fields.

#### REQ-3.4.2 Title and Tags Editor

The edit page exposes fields named "Title" and "Tags". Verified account "question_editor_title_tags@example.com" / "Password123!" edits question "SO Question Edit Title Tags", setting Title to "How can I safely retry an idempotent HTTP request in Node.js without duplicating side effects?" and Tags to "node.js".

**Type:** ATOMIC
**Dependencies:** REQ-3.4.1

**Scenarios:**

- Title and Tags Editor
  - **GIVEN:** User is on the Edit Question page.
  - **WHEN:** Change text in "Title" field and update "Tags"
  - **THEN:** Input fields reflect the new content.

#### REQ-3.4.3 Markdown Body Editor with Preview

The main rich-text workspace has a Body field, Markdown formatting tools, and a real-time preview. Verified account "question_editor_body_preview@example.com" / "Password123!" edits question "SO Question Edit Body Preview" with body "Updated question body that explains the current retry approach, failure modes, and what has already been tested in production environments.".

**Type:** ATOMIC
**Dependencies:** REQ-3.4.1

**Scenarios:**

- Markdown Body Editor with Preview
  - **GIVEN:** User is on the Edit Question page.
  - **WHEN:** Modify Markdown text in the "Body" textarea using the toolbar
  - **THEN:** The preview area below automatically updates to show the rendered HTML.

#### REQ-3.4.4 Edit Summary and Revision History

The edit page includes a combobox named "Rev" for previous versions and a field named "Edit Summary" that captures "Clarified retry requirements and added implementation context." for the next revision. The public question "SO Question Edit Save" is owned by question_editor@example.com and has an initial revision.

**Type:** ATOMIC
**Dependencies:** REQ-3.4.1

**Scenarios:**

- Edit Summary and Revision History
  - **GIVEN:** User is on the Edit Question page.
  - **WHEN:** Enter "Fixed a typo in the second paragraph" into the Edit Summary field
  - **THEN:** The summary is captured for the revision history.

#### REQ-3.4.5 Guidance Sidebar (How to Edit)

A supplemental widget displays heading "How to Edit" and an "Editing checklist" with community guidelines. Seed data: verified account "question_editor_guidance@example.com" and question "SO Question Edit Guidance".

**Type:** ATOMIC
**Dependencies:** REQ-3.4.1

**Scenarios:**

- Guidance Sidebar (How to Edit)
  - **GIVEN:** User is on the Edit Question page.
  - **WHEN:** Scan the "How to Edit" section on the right
  - **THEN:** Users see a checklist of best practices for editing.

### REQ-3.5 Delete Question

Question author can activate "Delete" for their own low-engagement question, review heading "Delete question?", and activate "Confirm deletion". The system contains verified account "question_deleter@example.com" / "Password123!" owning public question "SO Deletable Question", which has no answers and can be soft-deleted.

**Type:** ATOMIC
**Dependencies:** REQ-3.3, REQ-3.3.1

**Scenarios:**

- Delete Question
  - **GIVEN:** User is on a question detail page and has permission to delete.
  - **WHEN:** Click "Delete" button below question
  - **THEN:** Show confirmation dialog explaining deletion implications
  - **GIVEN:** Deletion confirmation dialog is visible.
  - **WHEN:** Click "Confirm deletion"
  - **THEN:** Soft delete question (mark as deleted, preserve in database), redirect to homepage

### REQ-3.6 Vote on Question

Users can upvote or downvote the question article containing the safe retry strategy. Its voting group contains buttons "Upvote" and "Downvote" and a status element named "Vote score". Voting changes that score and clicking the same vote again reverses the change; the question author's reputation is updated.

**Type:** FOLDER
**Dependencies:** REQ-3.3

#### REQ-3.6.1 Upvote Question

Lets a signed-in user upvote a question, updates the vote state immediately, and removes the vote when the same control is clicked again. The system contains a separate verified account with email "question_upvoter@example.com" and password "Password123!" that has not voted on the dedicated upvote question. The question "SO Upvote Question" is public, has an initial score of 7, and has no vote from question_upvoter@example.com.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Upvote Question
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Click upvote arrow on question
  - **THEN:** Increment vote count by 1, highlight upvote arrow, add 10 reputation to question author
  - **GIVEN:** The question is currently upvoted by the user.
  - **WHEN:** Click upvote arrow again
  - **THEN:** Remove upvote, decrement vote count, remove reputation bonus

#### REQ-3.6.2 Downvote Question

Lets a signed-in user activate the button named "Downvote" and applies the visible vote-state change and reputation impact. Verified account "question_downvoter@example.com" / "Password123!" has not voted on public question "SO Downvote Question", whose initial score is 3.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Downvote Question
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Click downvote arrow on question
  - **THEN:** Decrement vote count by 1, highlight downvote arrow, subtract 2 reputation from question author

## REQ-4 Answer Module

![image](./reference/question-page.jpeg) The answer module lives within the question detail page and covers composing answers, evaluating them, selecting an accepted answer, and maintaining answer revisions. A verified account with email "helpful_user@example.com", password "Password123!", and display name "Helpful User" authors the existing answers and comments used by these flows.

**Type:** FOLDER
**Dependencies:** REQ-3, REQ-3.3

### REQ-4.1 Answer Submission (Your Answer)

A dedicated section at the bottom of the Question Detail Page exposes the "Your Answer" editor and button "Post Your Answer". Verified account "answer_submitter@example.com" / "Password123!" can publish the answer "Use exponential backoff together with an idempotency key so duplicate requests can be safely retried without creating duplicate side effects in downstream services." on public question "SO Answer Submission Question".

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Answer Submission (Your Answer)
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Scroll to the "Your Answer" editor below the question and existing answers
  - **THEN:** The rich-text editor is visible and ready for input.
  - **GIVEN:** The 'Your Answer' editor is visible.
  - **WHEN:** Compose a response and click "Post Your Answer"
  - **THEN:** The new answer is appended to the list; the user is redirected or scrolled to their newly posted content. The answer appears in the profile page under "Answers" tab.

### REQ-4.2 Answer Evaluation (Voting)

Individual voting sidebars for each answer in the list, allowing the community to rank solutions by quality. The system contains a separate verified account with email "answer_voter@example.com" and password "Password123!" that has not voted on the dedicated answer-voting question. The question "SO Answer Voting Question" is public and contains a visible, unaccepted answer authored by Helpful User; answer_voter@example.com has not voted on that answer.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Answer Evaluation (Voting)
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Click the upvote/downvote arrows on an answer card
  - **THEN:** The answer's score updates; reputation is awarded/deducted from the answer author.

### REQ-4.3 Accepted Answer Selection

The question author can activate the control with accessible name "Accept answer" to mark one answer as definitive; afterward it has accessible name "Accepted answer" and a green checkmark. Verified account "answer_accept_owner@example.com" / "Password123!" owns public question "SO Accepted Answer Question", which contains a visible unaccepted answer authored by Helpful User.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Accepted Answer Selection
  - **GIVEN:** User is the question owner and is viewing the question detail page.
  - **WHEN:** Click the checkmark outline next to an answer
  - **THEN:** The answer is highlighted as accepted; the icon turns solid green and is exposed with the accessible label "Accepted answer".

### REQ-4.4 Answer List Controls & Sorting

Shows the answer count and lets the user reorder answers with the supported sort options. The question "SO Answer Sorting Question" is public and contains multiple visible answers so that Highest score, Trending, and Date modified sorting controls can be exercised.

**Type:** ATOMIC
**Dependencies:** REQ-3.3.1

**Scenarios:**

- Answer List Controls & Sorting
  - **GIVEN:** User is viewing the answers list on a question detail page.
  - **WHEN:** Click the "Sorted by" dropdown menu
  - **THEN:** Shows options like "Highest score", "Trending", and "Date modified".
  - **GIVEN:** The sort options list is visible.
  - **WHEN:** Select a different sorting method
  - **THEN:** The list of answers reorders immediately according to the selection.

### REQ-4.5 Edit Answer

Answer author can edit their answers to improve clarity or add information.

**Type:** FOLDER
**Dependencies:** REQ-4.1

#### REQ-4.5.1 Happy Path - Successfully Edit Answer

Verified account "answer_edit_user@example.com" / "Password123!" owns the target answer on "SO Successful Answer Edit Question". It changes the initial body "Use exponential backoff together with an idempotency key so duplicate requests can be safely retried without creating duplicate side effects in downstream services." to "Updated answer body describing exponential backoff, retry budgets, and idempotency keys for safe network retries.", enters edit summary "Expanded answer with retry-budget and idempotency details.", saves, appends a revision, and displays an "edited" timestamp.

**Type:** ATOMIC
**Dependencies:** REQ-4.1

**Scenarios:**

- Successfully Edit Answer
  - **GIVEN:** User is viewing their own answer.
  - **WHEN:** Click "Edit" link below your answer
  - **THEN:** Display answer editor with current content pre-filled.
  - **GIVEN:** Answer editor is visible.
  - **WHEN:** Modify the answer body and provide an "Edit Summary" describing the change.
  - **THEN:** Input fields reflect changes.
  - **WHEN:** Click "Save edits"
  - **THEN:** Update answer content, append to revision history, and display "edited" timestamp on the post.

#### REQ-4.5.2 Error - Empty Answer Body

Show the validation error "Body cannot be empty" and prevent submission. Seed data: verified account "answer_validation_empty@example.com" with a non-empty answer on "SO Answer Validation Empty Question".

**Type:** ATOMIC
**Dependencies:** REQ-4.1

**Scenarios:**

- Empty Answer Body
  - **GIVEN:** Answer editor is visible.
  - **WHEN:** Clear all text in the body and click "Save edits"
  - **THEN:** Show validation error "Body cannot be empty" and prevent submission.

#### REQ-4.5.3 Cancel Answer Editing

Verified account "answer_validation_cancel@example.com" / "Password123!" opens its non-empty answer on "SO Answer Validation Cancel Question", changes the editor text to "Updated answer body describing exponential backoff, retry budgets, and idempotency keys for safe network retries.", then activates "Cancel". The editor closes and the updated text is not saved or displayed.

**Type:** ATOMIC
**Dependencies:** REQ-4.1

**Scenarios:**

- Cancel Answer Editing
  - **GIVEN:** Answer editor is visible.
  - **WHEN:** Modify text and then click "Cancel"
  - **THEN:** Close editor and return to the original answer view without saving changes.

### REQ-4.6 Delete Answer

Answer author can activate "Delete" for an unaccepted answer, review heading "Delete answer?", and activate "Confirm deletion". Verified account "answer_delete_user@example.com" / "Password123!" owns the target answer on "SO Answer Delete Question" with body "This answer is reserved for the answer deletion scenario.".

**Type:** ATOMIC
**Dependencies:** REQ-4.1

**Scenarios:**

- Delete Answer
  - **GIVEN:** User is viewing their own answer.
  - **WHEN:** Click "Delete" link below answer
  - **THEN:** Show confirmation dialog explaining the consequences.
  - **GIVEN:** Deletion confirmation dialog is visible.
  - **WHEN:** Click "Confirm deletion"
  - **THEN:** Soft delete answer, remove from public display, and reverse any reputation changes associated with it.

## REQ-5 Comments Module

Supports short-form discussion on questions and answers, including posting, expanding, editing, deleting, voting on, and replying to comments. A verified account with email "helpful_user@example.com", password "Password123!", and display name "Helpful User" authors existing comments used by these flows.

**Type:** FOLDER
**Dependencies:** REQ-3, REQ-4

### REQ-5.1 Question Comments

Groups the interactions for creating and expanding comments that belong directly to a question post.

**Type:** FOLDER
**Dependencies:** REQ-3.3.6

#### REQ-5.1.1 Post Comment on Question

Lets an authenticated user add a comment directly below a question and immediately see it in the thread with author and timestamp metadata. The system contains a separate verified account with email "question_comment_user@example.com", password "Password123!", and display name "Stack User" that can publish a question comment. The question "SO Question Comment Question" is public and has a question-level Add a comment action.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Post Comment
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Click "Add a comment" below the question post
  - **THEN:** Display an inline comment input field for the question
  - **GIVEN:** The inline comment input field for the question is visible.
  - **WHEN:** Type a comment with at most 600 characters and submit it
  - **THEN:** Add the comment below the question and show the commenter name and timestamp.

#### REQ-5.1.2 View All Comments

Expands to show all comments for that post. The question "SO Expanded Comment Question" has more than 5 comments on a visible post, starts with a collapsed comment list, and includes a comment authored by Helpful User.

**Type:** ATOMIC
**Dependencies:** REQ-5.1.1

**Scenarios:**

- View All Comments
  - **GIVEN:** A post has more than 5 comments and is showing a collapsed comment list.
  - **WHEN:** Click "Show X more comments"
  - **THEN:** Expand to show all comments for that post

### REQ-5.2 Edit and Delete Comments

Comment authors can edit or delete their own comments within a time window.

**Type:** FOLDER
**Dependencies:** REQ-5.1.1

#### REQ-5.2.1 Edit Comment

Verified account "comment_edit_user@example.com" / "Password123!" owns comment "Can you share what you tried so far?" on "SO Comment Edit Question". The owner activates "Edit comment", changes field "Comment" to "Updated comment clarifying the original reproduction steps.", submits with Enter, and sees an "edited" indicator.

**Type:** ATOMIC
**Dependencies:** REQ-5.1.1

**Scenarios:**

- Edit Comment
  - **GIVEN:** User can see their own comment within the editable time window.
  - **WHEN:** Click "Edit" link next to own comment (within 5 minutes of posting)
  - **THEN:** Convert comment to editable text field
  - **GIVEN:** Comment is in edit mode.
  - **WHEN:** Modify text and press Enter
  - **THEN:** Update comment, show "edited" indicator

#### REQ-5.2.2 Delete Comment

The comment owner can activate "Delete comment" to remove the comment immediately without confirmation. Verified account "comment_delete_user@example.com" / "Password123!" owns the target comment "Can you share what you tried so far?" on "SO Comment Delete Question".

**Type:** ATOMIC
**Dependencies:** REQ-5.1.1

**Scenarios:**

- Delete Comment
  - **GIVEN:** User can see their own comment.
  - **WHEN:** Click "Delete" icon next to own comment
  - **THEN:** Remove comment immediately without confirmation

### REQ-5.3 Upvote Comment

Users can upvote comments to indicate they are helpful or relevant. Comments cannot be downvoted. The system contains a separate verified account with email "comment_vote_user@example.com" and password "Password123!" that has not voted on the dedicated comment. The question "SO Comment Vote Question" contains exactly one target comment with an initial upvote count of 1; comment_vote_user@example.com has not voted on it.

**Type:** ATOMIC
**Dependencies:** REQ-5.1, REQ-5.1.2

**Scenarios:**

- Upvote Comment
  - **GIVEN:** User can see a comment with an upvote control.
  - **WHEN:** Click upvote icon next to a comment
  - **THEN:** Increment comment upvote count by 1, highlight upvote icon
  - **GIVEN:** The comment is currently upvoted by the user.
  - **WHEN:** Click upvote icon again on same comment
  - **THEN:** Remove upvote, decrement count by 1, unhighlight icon

### REQ-5.4 Add Comment on Answer

Lets an authenticated user add a comment directly below an answer and immediately see it in the answer thread with author and timestamp metadata. The system contains a separate verified account with email "answer_comment_user@example.com", password "Password123!", and display name "Stack User" that can publish a comment below an answer. The question "SO Answer Comment Question" is public and contains a visible answer with an answer-level comment action.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-3.3.1

**Scenarios:**

- Add Comment on Answer
  - **GIVEN:** User is logged in and viewing a question detail page.
  - **WHEN:** Click "Add a comment" below an answer
  - **THEN:** Display an inline comment input field for that answer
  - **GIVEN:** The inline comment input field for the answer is visible.
  - **WHEN:** Type a comment with at most 600 characters and submit it
  - **THEN:** Add the comment below the answer and show the commenter name and timestamp.

### REQ-5.5 Reply to Comments

Verified account "comment_reply_user@example.com" / "Password123!" replies to the visible Helpful User comment on "SO Comment Reply Question" with "@Helpful User I tried exponential backoff and a request identifier.". The reply is displayed as a nested child item with the mention "@Helpful User".

**Type:** ATOMIC
**Dependencies:** REQ-5.1.1

**Scenarios:**

- Reply to Comments
  - **GIVEN:** User is logged in and can see a comment thread.
  - **WHEN:** Click "Reply" link next to a comment
  - **THEN:** Display inline reply input field below the parent comment
  - **GIVEN:** Inline reply input field is visible.
  - **WHEN:** Type reply text and press Enter or click "Add Reply"
  - **THEN:** Add reply as child comment, indented below parent, showing "@username" mention of parent commenter

## REQ-6 Tags Module

![image](./reference/tags-page.jpeg) Tags categorize questions and enable filtering. Each tag has a name, description, question count, and can be followed by users.

**Type:** FOLDER
**Dependencies:** REQ-3

### REQ-6.1 View All Tags

The navigation landmark named "Primary navigation" contains a button named "Tags" that opens a paginated list of all tags with names, descriptions, and question counts, sorted by popularity. The tag catalog contains the public tags "python", "javascript", "node.js", "http", and "retry", each with a description and question count.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- View All Tags
  - **GIVEN:** User is on a question list page and can access site navigation.
  - **WHEN:** Click "Tags" in main navigation
  - **THEN:** Display paginated list of all tags with names, descriptions, and question counts, sorted by popularity

### REQ-6.2 Tag Detail Page

Displays all questions with a specific tag and its description. The "python" tag page is headed "python" and displays the description "Python is a dynamically typed, multi-purpose programming language designed to be quick to learn, understand, and use." together with tagged questions.

**Type:** ATOMIC
**Dependencies:** REQ-6.1

**Scenarios:**

- Tag Detail Page
  - **GIVEN:** User can see a tag link.
  - **WHEN:** Click on a tag from tag list, question, or tag search
  - **THEN:** Display filtered question list showing only questions with that tag, with tag info header

### REQ-6.3 Follow Tags

Lets an authenticated user watch or unwatch a tag so the preference is reflected on the tag page and in question lists. Seed data: verified account "tag_watcher@example.com" with isolated tag "python-follow-test" initially unwatched.

**Type:** ATOMIC
**Dependencies:** REQ-2.2, REQ-6.2

**Scenarios:**

- Follow Tags
  - **GIVEN:** User is logged in and viewing a tag detail page.
  - **WHEN:** Click the "Watch tag" button
  - **THEN:** Add the tag to the user's watched tags and reflect the watched state on relevant question lists.
  - **GIVEN:** The tag is already being watched.
  - **WHEN:** Open the watched-state control
  - **THEN:** Show an "Unwatch tag" action.
  - **WHEN:** Click "Unwatch tag"
  - **THEN:** Return the control to the "Watch tag" state.

## REQ-7 Search and Filter Module

![image](./reference/search-and-filter.jpeg) Comprehensive search functionality allowing users to find questions by keywords, tags, user, date range, and other criteria.

**Type:** FOLDER
**Dependencies:** REQ-1

### REQ-7.1 Basic Search

Display matching public questions ranked by relevance. At least one indexed question has a title, body, or tags containing both "React" and "state", and both suggestions and results can return that question for the query "react state".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Basic Search
  - **GIVEN:** User can see the header search box, and the searchable public question index contains matching React/state-management content.
  - **WHEN:** Enter keywords in search box in header
  - **THEN:** Display real-time search suggestions
  - **WHEN:** Press Enter or click search icon
  - **THEN:** Display search results page with matching questions, ranked by relevance

### REQ-7.2 Filter Questions by Tab

Updates question list based on selected filter criteria.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Filter Questions by Tab
  - **GIVEN:** User can see filter tabs on a question list page.
  - **WHEN:** Click filter tabs (Newest, Active, Bountied, Unanswered, Frequent)
  - **THEN:** Update question list based on selected filter criteria

### REQ-7.3 Create Custom Filter

Verified account "filter_user@example.com" opens button "Filter" and region "Filter panel", selects checkbox "No answers" and radio "Newest", enters isolated tag "python-filter-test" in field "Tag", enters "Python unanswered filter" in field "Filter title", and activates "Save filter". The confirmation text is "Filter saved: Python unanswered filter".

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- Create Custom Filter
  - **GIVEN:** User is on a question list page.
  - **WHEN:** Click the "Filter" button
  - **THEN:** Display a filter panel with additional criteria.
  - **GIVEN:** The filter panel is visible.
  - **WHEN:** Select filter checkboxes, choose a sort option, and enter tag criteria
  - **THEN:** Keep the selected filter values visible in the panel.
  - **WHEN:** Click "Save custom filter"
  - **THEN:** Open the custom filter save dialog.
  - **GIVEN:** The custom filter save dialog is visible.
  - **WHEN:** Enter a filter title and click "Save filter"
  - **THEN:** Save the filter and show the filtered question list.

## REQ-8 Reputation and Badges System

Gamification system tracking user contributions through reputation points and achievement badges. Reputation unlocks privileges at various thresholds.

**Type:** FOLDER
**Dependencies:** REQ-2

### REQ-8.1 View Reputation History

Displays chronological list of reputation changes with reasons and linked posts. The system contains a separate verified account with email "activity_user@example.com", password "Password123!", display name "Stack User", and permission to view reputation and activity data. The activity_user@example.com profile contains Answers, Questions, and Responses activity, together with reputation records including "answer upvoted", "question upvoted", and visible +10 or +5 changes.

**Type:** ATOMIC
**Dependencies:** REQ-2.3

**Scenarios:**

- View Reputation History
  - **GIVEN:** User has permission to view reputation history on the profile.
  - **WHEN:** Click "Reputation" tab on user profile
  - **THEN:** Display chronological list of reputation changes with reasons and linked posts

### REQ-8.2 Earn Badges

Groups the badge-awarding behaviors that recognize qualifying user activity and expose badges through notifications and badge listings.

**Type:** FOLDER
**Dependencies:** REQ-2.2

#### REQ-8.2.1 Badge Award Notification

Awards a badge when the user meets a badge rule, shows a notification, and records the badge on the user profile. The system contains a separate verified account with email "badge_user@example.com", password "Password123!", and a profile eligible to display an earned badge notification. The badge_user@example.com profile contains an earned Teacher badge or an equivalent badge-earned notification visible on the profile.

**Type:** ATOMIC
**Dependencies:** REQ-2.2

**Scenarios:**

- Badge Award Notification
  - **GIVEN:** User performs actions that meet a badge's criteria.
  - **WHEN:** Trigger badge criteria (e.g., receive 10 upvotes on answer)
  - **THEN:** Award badge to user, show notification popup, display on profile

#### REQ-8.2.2 View All Badges

The navigation landmark named "Primary navigation" contains button "Badges". It opens heading "Badges" and the headings "Gold badges", "Silver badges", and "Bronze badges", including badge headings "Great Answer" and "Teacher" with descriptions and earn counts.

**Type:** ATOMIC
**Dependencies:** REQ-1.1

**Scenarios:**

- View All Badges
  - **GIVEN:** User can access site navigation.
  - **WHEN:** Click "Badges" in navigation or profile
  - **THEN:** Display categorized list of all available badges with descriptions and earn counts

## REQ-9 User Activity Feed

![image](./reference/user-feed.jpeg) The activity area of a user profile consolidates the user's posts, reputation history, badges, votes, and responses into navigable views. The system contains a separate verified account with email "activity_user@example.com", password "Password123!", display name "Stack User", and permission to view reputation and activity data. The activity_user@example.com profile contains Answers, Questions, and Responses activity, together with reputation records including "answer upvoted", "question upvoted", and visible +10 or +5 changes.

**Type:** FOLDER
**Dependencies:** REQ-2

### REQ-9.1 View Activity Tab

Displays the activity layout with a vertical navigation sidebar and content area.

**Type:** ATOMIC
**Dependencies:** REQ-2.3

**Scenarios:**

- View Activity Tab
  - **GIVEN:** User has permission to view the target user's activity.
  - **WHEN:** Navigate to user profile and click the "Activity" tab
  - **THEN:** Display the activity layout with a vertical navigation sidebar and content area.

### REQ-9.2 Activity Sidebar Navigation

Vertical menu in the Activity tab providing access to various content types: Summary, Answers, Questions, Tags, Articles, Badges, Following, Bounties, Reputation, All actions, Responses, and Votes.

**Type:** ATOMIC
**Dependencies:** REQ-9.1

**Scenarios:**

- Activity Sidebar Navigation
  - **GIVEN:** User is on the Activity tab and can see the activity sidebar.
  - **WHEN:** Click on different items in the activity sidebar
  - **THEN:** The right-side content area updates to reflect the selected category without full page reload.

### REQ-9.3 User Answers History

Displays a list of all answers provided by the user. Includes sorting by score, activity, or newest. Shows question titles and answer status (e.g., accepted).

**Type:** ATOMIC
**Dependencies:** REQ-9.1

**Scenarios:**

- User Answers History
  - **GIVEN:** User is on the Activity tab.
  - **WHEN:** Click "Answers" in the activity sidebar
  - **THEN:** Display paginated list of answers with sorting controls (Score, Activity, Newest).

### REQ-9.4 User Questions History

Lists all questions posted by the user. Includes metadata like votes, answers, and view counts for each question.

**Type:** ATOMIC
**Dependencies:** REQ-9.1

**Scenarios:**

- User Questions History
  - **GIVEN:** User is on the Activity tab.
  - **WHEN:** Click "Questions" in the activity sidebar
  - **THEN:** Display list of user questions with engagement metrics.

### REQ-9.5 Reputation and Engagement Tracking

Detailed view of reputation changes, badge earnings, and voting history. Provides a chronological log of how the user's standing has evolved.

**Type:** ATOMIC
**Dependencies:** REQ-9.1

**Scenarios:**

- Reputation and Engagement Tracking
  - **GIVEN:** User is on the Activity tab.
  - **WHEN:** Click "Reputation" or "Votes" in the sidebar
  - **THEN:** Show detailed logs of reputation points or voting actions (privately for votes).

### REQ-9.6 User Responses and Comments

Consolidated view of all comments and replies made by the user across questions and answers.

**Type:** ATOMIC
**Dependencies:** REQ-9.1

**Scenarios:**

- User Responses and Comments
  - **GIVEN:** User is on the Activity tab.
  - **WHEN:** Click "Responses" in the activity sidebar
  - **THEN:** Display a list of comments/replies linked to their respective parent posts.
