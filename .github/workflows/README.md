# GitHub Actions Workflows

This directory contains automated workflows for the Marvel Spider-Man MTG Collection Tracker.

## Workflows

### 1. Validate Card List (`validate-cards.yml`)

**Purpose:** Validates the card list against the MTGGoldfish reference whenever card data changes.

**Triggers:**
- Push to `main` or `develop` branches (when relevant files change)
- Pull requests to `main` or `develop` branches
- Manual trigger via GitHub UI

**What it does:**
1. Checks out the repository
2. Sets up Node.js environment
3. Runs the card validation test suite
4. Generates a summary report
5. Uploads test results as artifacts (kept for 30 days)

**Files monitored:**
- `backend/data/cards.json`
- `fetch-cards.js`
- `test-cards.js`
- This workflow file

**Manual triggering:**
1. Go to Actions tab in GitHub
2. Select "Validate Card List" workflow
3. Click "Run workflow"

---

### 2. Check for Card Updates (`check-card-updates.yml`)

**Purpose:** Automatically checks Scryfall for card updates and creates a PR if changes are detected.

**Triggers:**
- Scheduled: Every Monday at 9:00 AM UTC
- Manual trigger via GitHub UI

**What it does:**
1. Backs up current card data
2. Fetches latest cards from Scryfall API
3. Compares old vs new data
4. If changes detected:
   - Runs validation tests
   - Creates a Pull Request with the updates
   - Includes change summary (card count differences)
5. Generates a summary report

**Manual triggering:**
1. Go to Actions tab in GitHub
2. Select "Check for Card Updates" workflow
3. Click "Run workflow"

---

## Requirements

Both workflows require:
- Node.js 18
- No external dependencies beyond what's in `package.json`

## Validation Reference

All validations are performed against the official MTGGoldfish set page:
https://www.mtggoldfish.com/sets/Marvel+Spider-Man/All+Cards#online

## Viewing Results

### In Pull Requests
When a PR is created, the validation workflow runs automatically. Results appear:
- In the PR checks section
- As a comment summary (if configured)
- In the Actions tab

### In the Actions Tab
1. Go to your repository's Actions tab
2. Select the workflow run
3. View the summary and detailed logs
4. Download test result artifacts if needed

## Troubleshooting

### Workflow fails on validation
- Check the test output in the workflow logs
- Review warnings about missing cards or count mismatches
- Manually compare against MTGGoldfish if needed

### Scheduled workflow not running
- Ensure GitHub Actions are enabled for the repository
- Check repository settings → Actions → General
- Scheduled workflows may be disabled on forks

### PR not created automatically
- Verify the `peter-evans/create-pull-request` action has permissions
- Check repository settings → Actions → General → Workflow permissions
- Ensure "Allow GitHub Actions to create and approve pull requests" is enabled

## Local Testing

Before pushing changes, you can test locally:

```bash
# Run validation tests
npm test

# Fetch latest card data
node fetch-cards.js
```
