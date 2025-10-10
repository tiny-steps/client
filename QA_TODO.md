## QA Todo Tracker

Single source of truth for tester-reported issues and progress. We will update this file as tasks move from pending → in progress → done.

Legend: [ ] Pending, [~] In Progress, [x] Done

### Doctor module

- [~] Fix image upload UX, add mandatory indicator, ensure list/view show photo
- [ ] Handle duplicate email/mobile gracefully (no 500)
- [ ] Fix edit page not pre-filling existing data
- [ ] Fix search filters (Speciality), invalid input should yield zero results
- [ ] Remove "Manage Branches" option from Doctor module UI
- [ ] Remove rating and total reviews from Doctor view page
- [ ] Replace Summary/About with Remarks in create/edit/view
- [ ] Fix activation status sync: dashboard totals, tab counts, cross-branch reflection
- [ ] Hide deactivated doctors in all selectors and Timing module
- [ ] Remove delete option for Doctor
- [ ] Define and implement cookie/localStorage clear policy on app load

### Awards

- [ ] White background for create/edit pages
- [ ] Delete action works
- [ ] Doctor reassignment (save to different doctor)
- [ ] Hide deactivated doctors in selector
- [ ] Enforce 250-char summary with validation message

### Qualifications

- [ ] White background for create/edit pages
- [ ] Delete action works
- [ ] Doctor reassignment
- [ ] Hide deactivated doctors in selector
- [ ] Enforce 250-char summary with validation message

### Specializations

- [ ] White background for create/edit pages
- [ ] Delete action works
- [ ] Doctor reassignment
- [ ] Hide deactivated doctors in selector
- [ ] Enforce 250-char summary with validation message

### Patients

- [ ] Ensure patient page loads
- [ ] Make email non-mandatory

### Timing Management

- [ ] Implement Time Offs
- [ ] Make practiceId non-mandatory
- [ ] Edited employee description appears in list
- [ ] Delete action works
- [ ] White background on forms
- [ ] Hide deactivated doctors in selectors

### Session Types

- [ ] Add availability checks; prevent booking if unavailable

### Session Management

- [ ] Hide deactivated doctors
- [ ] Enforce single session per doctor
- [ ] Change currency display to INR

### Schedule/Calendar

- [ ] Fix day mismatch across views
- [ ] Fix errors for tomorrow bookings

### Appointment booking flow

- [ ] Map doctors to allowed session types in booking; show only mapped types
- [ ] Remove "modify duration" option
- [ ] Add the three green dot indicator
- [ ] Fix dashboard booking data not displaying
- [ ] Unblock booking failures

### Errors/Stability

- [ ] Fix "Unexpected end of JSON input" during booking
- [ ] Stabilize fetch of doctors with branch status; add error handling/retries

### Branch Management

- [ ] Fix inability to create branch

### Doctor forms UX

- [ ] Show validation toasts on create/update
- [ ] Pre-fill specialization on edit

### Search validation

- [ ] Make experience input numeric-only
- [ ] Add field max-lengths
- [ ] After invalid search, show total count as zero
