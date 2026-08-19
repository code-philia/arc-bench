# Keep
Note management system for creating, organizing, searching, and configuring personal notes.

## REQ-1 Google Keep Home Page
Main workspace of the application. It shows the notes area, pinned notes section, header actions, search entry, settings entry, sidebar navigation, and quick label access. Reference image: ![image](./reference/home_page.png)

**Dependencies:** None

### REQ-1.1 Enter Website
Open the application and display the home page.

**Dependencies:** None

**Scenarios:**
- Enter Website
  - **GIVEN:** User has a browser or app with network access.
  - **WHEN:** Open the application entry URL.
  - **THEN:** The home page is displayed.

## REQ-2 Notes Management
Core note management capability for listing, creating, updating, deleting, archiving, coloring, labeling, and pinning notes. Reference image: ![image](./reference/home_page.png)

**Dependencies:** REQ-1

### REQ-2.1 Note Listing
Display the notes list on the home page with pinned notes shown separately from unpinned notes.

**Dependencies:** REQ-1.1

**Scenarios:**
- Note Listing
  - **GIVEN:** User has opened the application and the system is accessible.
  - **WHEN:** View the home page.
  - **THEN:** The page displays the available notes list, with pinned notes separated from regular notes.

### REQ-2.2 Create Note
Create a note from the Take a note form, expand the editor for title and content, and autosave the note when the editor is closed. Take a note form from homepage image: ![image](./reference/create_note_home_page.png) Note form image: ![image](./reference/create_note_form.png)

**Dependencies:** REQ-2.1

**Scenarios:**
- Create Note
  - **GIVEN:** User is on the home page.
  - **WHEN:** Click the "Take a note" form, enter a title and content, and close the editor.
  - **THEN:** The note is autosaved, the editor closes, and the note appears in the notes list.

### REQ-2.3 Delete Note
Delete notes from the note actions menu and manage the deleted-note recovery flow.

**Dependencies:** REQ-2.2

#### REQ-2.3.1 Delete
Delete a note from the note actions menu without an extra confirmation dialog. Dropdown image: ![image](./reference/note_more_options_dropdown.png)

**Dependencies:** REQ-2.2

**Scenarios:**
- Delete
  - **GIVEN:** User is on the home page and can see at least one note.
  - **WHEN:** Hover over a note, open More options, and choose "Delete Note".
  - **THEN:** The note is removed from the main notes list and a delete notification is shown.

#### REQ-2.3.2 Notification and Undo
Show a delete notification with an Undo action after a note is deleted, allow recovery through Undo, and allow the notification to dismiss automatically or be closed manually. Reference image for notification: ![image](./reference/note_delete_notification.png)

**Dependencies:** REQ-2.3.1

**Scenarios:**
- Notification and Undo
  - **GIVEN:** User has just deleted a note from the home page.
  - **WHEN:** Click the Undo button in the visible delete notification.
  - **THEN:** The note is restored and the page shows an "Action undone" notification.

#### REQ-2.3.3 Trash list
Open the Trash view from the sidebar and display deleted notes, with support for emptying trash and automatic deletion after seven days. Reference image: ![image](./reference/trash_list.png)

**Dependencies:** REQ-2.3.1

**Scenarios:**
- Trash list
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click the Trash item in the sidebar.
  - **THEN:** The page displays the list of deleted notes.

### REQ-2.4 Update Note
Edit the content of an existing note and persist the updated note after the editor is closed. Reference image: ![image](./reference/note_editing.png)

**Dependencies:** REQ-2.2

**Scenarios:**
- Update Note
  - **GIVEN:** User is on the home page and can see a note.
  - **WHEN:** Open the note, edit its content, and close the note editor.
  - **THEN:** The note editor closes and the updated content is saved.

### REQ-2.5 Archive Note
Archive and unarchive notes, and show the archived notes list separately from active notes.

**Dependencies:** REQ-2.2

#### REQ-2.5.1 Archive
Archive a note from the note actions area and show an Undo notification. Reference image: ![image](./reference/archive_button.png)

**Dependencies:** REQ-2.2

**Scenarios:**
- Archive
  - **GIVEN:** User is on the home page and can see a note.
  - **WHEN:** Click the archive button on the note.
  - **THEN:** The note moves to the archive list and the page shows a notification with an Undo action.

#### REQ-2.5.2 Archive Undo
Restore an archived note by using the Undo action from the archive notification.

**Dependencies:** REQ-2.5.1

**Scenarios:**
- Archive Undo
  - **GIVEN:** The archive notification is visible after archiving a note.
  - **WHEN:** Click the Undo action in the notification.
  - **THEN:** The note returns to the main notes list.

#### REQ-2.5.3 Show archived notes
Open the Archived view from the sidebar and display all archived notes. Reference image: ![image](./reference/archived_notes_page.png)

**Dependencies:** REQ-2.5.1

**Scenarios:**
- Show archived notes
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click Archived in the sidebar.
  - **THEN:** The page displays the archived notes list.

#### REQ-2.5.4 Unarchive
Restore an archived note from the archived notes list. Reference image: ![image](./reference/unarchive_button.png)

**Dependencies:** REQ-2.5.3

**Scenarios:**
- Unarchive
  - **GIVEN:** User is viewing the archived notes list.
  - **WHEN:** Click Unarchive on an archived note.
  - **THEN:** The note is removed from the archived list and returned to the main notes list.

### REQ-2.6 Note Coloring
Allow users to apply different background colors to notes during creation and after a note already exists. Reference image: ![image](./reference/note_coloring.png)

**Dependencies:** REQ-2.2

#### REQ-2.6.1 Change note color
Change the color of an existing note.

**Dependencies:** REQ-2.2

**Scenarios:**
- Change note color
  - **GIVEN:** User is on the home page and can see a note.
  - **WHEN:** Open the color palette for the note and choose the light green color.
  - **THEN:** The note background changes to light green.

#### REQ-2.6.2 Choose note color when created
Set the color of a note during note creation.

**Dependencies:** REQ-2.2

**Scenarios:**
- Choose note color when created
  - **GIVEN:** User has opened the "Take a note" editor.
  - **WHEN:** Open the color palette, choose a color, enter a title and content, and close the editor.
  - **THEN:** The created note is saved with the selected color.

### REQ-2.7 Labels Management
Allow users to assign labels to notes, manage labels, and filter notes by label.

**Dependencies:** REQ-2.2

#### REQ-2.7.1 Assign label to a note
Assign one or more labels to an existing note. Reference image: ![image](./reference/assign_label_to_note.png)

**Dependencies:** REQ-2.2

**Scenarios:**
- Assign label to a note
  - **GIVEN:** User is on the home page and can see a note.
  - **WHEN:** Open More options, choose "Change labels", and select a label.
  - **THEN:** The selected label is assigned to the note and displayed on the note.

#### REQ-2.7.2 Remove label from a note
Remove an assigned label from a note.

**Dependencies:** REQ-2.7.1

**Scenarios:**
- Remove label from a note
  - **GIVEN:** User is on the home page and can see a note that already has a label.
  - **WHEN:** Open More options, choose "Change labels", and clear the selected label.
  - **THEN:** The label is removed from the note.

#### REQ-2.7.3 Default label
Provide "Reminders" as a default label in the label list.

**Dependencies:** None

**Scenarios:**
- Default label
  - **GIVEN:** The system has been initialized.
  - **WHEN:** View the labels list.
  - **THEN:** The labels list includes "Reminders" as a default label with its own icon.

#### REQ-2.7.4 Assign default label when creating note
Assign the default "Reminders" label during note creation.

**Dependencies:** REQ-2.7.3

**Scenarios:**
- Assign default label when creating note
  - **GIVEN:** User is on the home page and the "Take a note" editor is open.
  - **WHEN:** Choose the "Reminders" label, enter a title and content, and close the editor.
  - **THEN:** The created note is saved with the "Reminders" label.

#### REQ-2.7.5 Edit labels
Create, rename, and delete labels from the label management list. Reference image: ![image](./reference/manage_labels.png)

**Dependencies:** REQ-2.7.1

**Scenarios:**
- Edit labels
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click "Edit Labels", change a label name, and save the update.
  - **THEN:** The label list reflects the saved changes.

#### REQ-2.7.6 View by labels
Show all labels in the sidebar and allow users to filter the notes list by the selected label. Reference image: ![image](./reference/label_filtered_list.png)

**Dependencies:** REQ-2.7.1

##### REQ-2.7.6.1 View list filtered by label
Filter the notes list by a selected label.

**Dependencies:** REQ-2.7.1

**Scenarios:**
- View list filtered by label
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click a specific label in the sidebar.
  - **THEN:** The notes list shows only notes that have the selected label.

##### REQ-2.7.6.2 View all notes
Return from a label-filtered view to the full notes list.

**Dependencies:** REQ-2.7.6.1

**Scenarios:**
- View all notes
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click "Notes" in the sidebar.
  - **THEN:** The notes list shows all notes.

##### REQ-2.7.6.3 View Reminders
Filter the notes list by the default "Reminders" label.

**Dependencies:** REQ-2.7.3

**Scenarios:**
- View Reminders
  - **GIVEN:** User can see the sidebar.
  - **WHEN:** Click "Reminders" in the sidebar.
  - **THEN:** The notes list shows only notes with the "Reminders" label.

### REQ-2.8 Pinned Notes
Allow users to pin frequently used notes to the top of the notes list and unpin them later.

**Dependencies:** REQ-2.2

#### REQ-2.8.1 Pin note
Pin an existing note from the note card. Reference image: ![image](./reference/pin_button.png)

**Dependencies:** REQ-2.2

**Scenarios:**
- Pin note
  - **GIVEN:** User is on the home page and can see a note.
  - **WHEN:** Click the pin button on the note.
  - **THEN:** The pin state is shown and the note appears in the pinned section at the top of the page.

#### REQ-2.8.2 Unpin note
Remove the pinned state from a pinned note.

**Dependencies:** REQ-2.8.1

**Scenarios:**
- Unpin note
  - **GIVEN:** User is on the home page and the note is pinned.
  - **WHEN:** Click the unpin button on the pinned note.
  - **THEN:** The note is removed from the pinned section and returned to the regular notes list.

#### REQ-2.8.3 Pin note when creating it
Create a note in the pinned state.

**Dependencies:** REQ-2.2

**Scenarios:**
- Pin note when creating it
  - **GIVEN:** User is on the home page and the "Take a note" editor is open.
  - **WHEN:** Enter a title and content, click the pin button, and close the editor.
  - **THEN:** The note is created and displayed in the pinned section.

## REQ-3 Search
Allow users to search notes by keywords and supported filters.

**Dependencies:** REQ-2

### REQ-3.1 Initial suggested filters
Show suggested search filters after the search bar is focused and filter the notes list when one is selected. Image reference: ![image](./reference/search_suggested_filters.png)

**Dependencies:** REQ-1.1

**Scenarios:**
- Initial suggested filters
  - **GIVEN:** User is on the home page.
  - **WHEN:** Click the search bar at the top and choose a suggested filter.
  - **THEN:** The notes list shows only notes that match the selected filter.

### REQ-3.2 Search by keyword
Search notes by keyword and highlight matching text in the results. Image reference: ![image](./reference/search_keyword.png)

**Dependencies:** REQ-3.1

**Scenarios:**
- Search by keyword
  - **GIVEN:** User is on the home page.
  - **WHEN:** Click the search bar and enter the keyword "st".
  - **THEN:** The notes list shows matching notes with the matching text highlighted.

## REQ-4 Settings
Allow users to manage common application settings.

**Dependencies:** REQ-2

### REQ-4.1 Setting options list
Display the settings options menu from the settings icon. Reference image: ![image](./reference/settings_dropdown.png)

**Dependencies:** REQ-1.1

**Scenarios:**
- Setting options list
  - **GIVEN:** User is on the home page.
  - **WHEN:** Click the settings icon.
  - **THEN:** The page displays the list of settings options.

### REQ-4.2 Detailed settings
Open the detailed settings page and display configurable application options such as moving new notes or checked items to the bottom. ![image](./reference/settings_settings.png)

**Dependencies:** REQ-4.1

**Scenarios:**
- Detailed settings
  - **GIVEN:** User is on the home page and the settings options list is visible.
  - **WHEN:** Click "Settings".
  - **THEN:** The page focuses on a list of configurable options with save and cancel actions.

## REQ-5 List View & Grid View
Allow users to switch between grid view and list view for notes. Reference image for list view: ![image](./reference/list_view.png)

**Dependencies:** REQ-2

### REQ-5.1 Toggle between list and grid views
Switch between list view and grid view from the home page toolbar.

**Dependencies:** REQ-1.1

**Scenarios:**
- Toggle between list and grid views
  - **GIVEN:** User is on the home page.
  - **WHEN:** Click the list-view icon and then click the grid-view icon.
  - **THEN:** The page switches to list view and then switches back to grid view.

### REQ-5.2 Grid View by default
Display notes in grid view by default when the home page first loads.

**Dependencies:** REQ-1.1

**Scenarios:**
- Grid View by default
  - **GIVEN:** User has a browser or app with network access.
  - **WHEN:** Open the application entry URL.
  - **THEN:** The notes page opens in grid view and the toolbar shows the list-view toggle.

## REQ-6 Sidebar
Sidebar for common navigation actions such as notes, labels, archive, and trash.

**Dependencies:** REQ-2

### REQ-6.1 Items and styling
Display sidebar items with consistent icons, alignment, hover state, and selected-item highlighting. Reference image: ![image](./reference/sidebar.png)

**Dependencies:** REQ-1.1

**Scenarios:**
- Items and styling
  - **GIVEN:** User has opened the application.
  - **WHEN:** View the page after the home page loads.
  - **THEN:** The page shows an open sidebar with consistent styling and clearly identifiable navigation items.

### REQ-6.2 Collapsible Sidebar
Collapse the sidebar to an icon-only view and expand it again from the same control. Reference image: ![image](./reference/sidebar_collapsed.png)

**Dependencies:** REQ-6.1

**Scenarios:**
- Collapsible Sidebar
  - **GIVEN:** The sidebar is expanded.
  - **WHEN:** Click the sidebar collapse control and then click it again.
  - **THEN:** The sidebar first collapses to an icon-only view and then expands to show both icons and labels again.
