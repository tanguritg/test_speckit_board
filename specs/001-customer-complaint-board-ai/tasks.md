# Tasks: Customer Complaint Board with AI Auto-response

**Input**: Design documents from `specs/001-customer-complaint-board-ai/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure (index.html, style.css, app.js) in the project root
- [X] T002 Initialize a basic project with a local development server (e.g., live-server or simple python http server)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Define basic HTML5 boilerplate and main layout containers in `index.html`
- [X] T004 [P] Define CSS custom properties (colors, typography) and layout grid in `style.css`
- [X] T005 [P] Implement `localStorage` wrapper functions for `Complaint` and `AIResponse` storage in `app.js`
- [X] T006 [P] Implement a basic UUID generator or unique ID utility in `app.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Submit & Auto-respond (Priority: P1) 🎯 MVP

**Goal**: User submits a complaint and receives an AI-generated response immediately.

**Independent Test**: Submit a complaint via the form and verify that a response is displayed within the UI without page refresh.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create the complaint submission form (Title, Content, Author) in `index.html`
- [X] T008 [P] [US1] Apply empathetic and professional styling to the submission form in `style.css`
- [X] T009 [US1] Implement `submitComplaint` logic to capture form data and save to `localStorage` in `app.js`
- [X] T010 [US1] Implement `generateAIResponse` using Gemini API fetch as defined in `research.md` and `contracts/js-internal.md` in `app.js`
- [X] T011 [US1] Implement UI update logic to show the "Processing..." state and subsequent AI response in `app.js`

**Checkpoint**: User Story 1 is functional - Complaints can be submitted and auto-responded to.

---

## Phase 4: User Story 2 - View Board (Priority: P2)

**Goal**: Users and staff can view a list of all complaints and their AI responses.

**Independent Test**: Navigate to the board view and see multiple previous complaints rendered in a list format.

### Implementation for User Story 2

- [X] T012 [P] [US2] Create the Board container and list structure in `index.html`
- [X] T013 [P] [US2] Style the complaint cards and response bubbles in `style.css`
- [X] T014 [US2] Implement `loadComplaints` to fetch all entries from `localStorage` and render them to the board in `app.js`
- [X] T015 [US2] Add sorting logic (newest first) to the complaint list in `app.js`

**Checkpoint**: User Story 2 is functional - The board displays a history of complaints.

---

## Phase 5: User Story 3 - Error Handling (Priority: P3)

**Goal**: System provides a polite fallback if the AI service fails.

**Independent Test**: Mock a failed API call (or disconnect network) and verify the "Human will review soon" message appears.

### Implementation for User Story 3

- [X] T016 [US3] Implement try/catch blocks and timeout handling in `generateAIResponse` in `app.js`
- [X] T017 [US3] Create a fallback response template following Principle II (Commercial Reliability) in `app.js`
- [X] T018 [P] [US3] Add visual error/warning styles for failed AI processing in `style.css`

**Checkpoint**: System is robust against AI failures.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Privacy masking, Staff review mode, and final refinement.

- [X] T019 [P] Implement `maskPII` regex utility as researched in `research.md` in `app.js`
- [X] T020 [US1] Integrate `maskPII` into the public board display logic in `app.js`
- [X] T021 [P] Create "Staff Mode" UI elements (Edit buttons, Status toggles) in `index.html`
- [X] T022 [P] Style "Staff Mode" components to distinguish from public view in `style.css`
- [X] T023 Implement the Staff Review toggle logic (via URL param or localStorage) in `app.js`
- [X] T024 Implement Staff edit/approve functionality as defined in `spec.md` (FR-007) in `app.js`
- [X] T025 Final validation of all flows against `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on T001 completion.
- **User Stories (Phase 3+)**: Depend on Foundational (Phase 2) completion. US1 is the MVP and should be prioritized.
- **Polish (Final Phase)**: Depends on US1 and US2 completion.

### Parallel Opportunities

- T003, T004, T005, T006 can be done in parallel (Foundational).
- T007 (HTML) and T008 (CSS) for US1 can be done in parallel.
- T012 (HTML) and T013 (CSS) for US2 can be done in parallel.
- T021 (HTML) and T022 (CSS) for Staff Mode can be done in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel UI work for US1:
Task T007: "Create the complaint submission form in index.html"
Task T008: "Apply empathetic and professional styling in style.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. Validate that a single complaint can be submitted and responded to.

### Incremental Delivery
1. Add Board View (US2) to see history.
2. Add Error Handling (US3) for robustness.
3. Add Polish (PII Masking & Staff Review) to meet final specification requirements.
