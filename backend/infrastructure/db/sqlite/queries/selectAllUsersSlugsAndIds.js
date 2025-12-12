'use strict';

export const selectAllUsersSlugsAndIds = (db) => {
  const stmt = db.prepare(`SELECT slug, codewars_id FROM users`);
  const rows = stmt.all();

  const slugs = new Set();
  const ids = new Set();

  rows.forEach((r) => {
    slugs.add(r.slug);
    ids.add(r.codewars_id);
  });

  return { slugs, ids };
};
