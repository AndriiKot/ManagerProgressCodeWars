'use strict';

export const getCodewarsSyncWorkflow = () => {
  return `name: Codewars Sync

on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Codewars sync
        run: npx codewars-bot sync

      - name: Commit & push changes
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            git config user.name "codewars-bot"
            git config user.email "codewars-bot@users.noreply.github.com"
            git add .
            git commit -m "chore: sync Codewars progress"
            git push
          else
            echo "No changes to commit"
`;
};
