'use strict';

export const buildInitConfig = (profile, outputDir) => ({
  username: profile.username,
  languages: Object.keys(profile.ranks.languages),
  autoCommit: true,
  outputDir,
  lastSync: null,
});

