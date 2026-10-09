# CivicVote — Student Election Portal (Frontend)

A responsive voting web app frontend built with HTML, CSS, and vanilla JavaScript. It is designed as a presentable academic prototype that is not too simple to demonstrate, but remains easy to explain and defend.

## Features
- Dashboard with election status, participation figures, ballot positions, and timeline
- Candidate cards with department and manifesto summaries
- One selection per position, with visual selected states
- Progress bar and selection count
- Review modal before final confirmation
- Demo ballot submission state saved in browser `localStorage`
- Sample results with percentage bars
- Voting guide and FAQ
- Responsive layout for mobile and desktop
- Keyboard-focus styles and accessible labels on key controls

## Run it
1. Extract the ZIP file.
2. Open `index.html` in a browser, or use VS Code's Live Server extension.
3. Navigate using the left menu.
4. Open **Cast your vote**, select one candidate for each of the three positions, and press **Review my vote**.
5. Check the review modal and select **Confirm vote**.

No package installation or build step is required.

## Project files
- `index.html` — page structure and interface sections
- `style.css` — layout, colors, responsive styling, and modal styles
- `script.js` — candidate sample data, navigation, selection rules, review flow, result rendering, and browser storage

## How to defend the project
**Problem:** Student elections need a clear interface where eligible voters can review candidates and submit one choice for each position.

**Main user flow:** Overview → Cast your vote → Select one candidate per position → Review ballot → Confirm vote.

**Validation in this prototype:** The review button stays disabled until every position has a selection. The data model stores one candidate ID per position, so selecting a different candidate replaces the previous choice. After confirmation, the demo disables further changes.

**Data storage:** `localStorage` is used only to preserve the demo selections and submission status in the same browser. It is not a secure voting database.

**Important limitation:** This is a frontend-only prototype with sample data. It does not verify identity, prevent tampering, or submit votes to a server. A real election would need a backend API, secure authentication, server-side validation, database constraints, authorization, audit logs, privacy protections, and security testing. Do not use this prototype to conduct a real election.

## Reset the demo
To test voting again, open the browser developer tools → Application/Storage → Local Storage → remove the `civicvote-demo-v1` key for the page, then refresh. Or clear the site's local storage in browser settings.
