'use strict';

import test from "node:test";
import assert from "node:assert/strict";
import { API_CODEWARS_URL } from "./urls.js";

const { Users_API, List_Completed_Challenges, List_Authored_Challenges, Code_Challenges_API } = API_CODEWARS_URL;

test("API_CODEWARS_URL returns correct URLs", () => {
  assert.strictEqual(
    Users_API("alice"),
    "https://www.codewars.com/api/v1/users/alice"
  );      

  assert.strictEqual(
    List_Completed_Challenges("alice", 2),
    "https://www.codewars.com/api/v1/users/alice/code-challenges/completed?page=2"
  );

  assert.strictEqual(
    List_Authored_Challenges("bob"),
    "https://www.codewars.com/api/v1/users/bob/code-challenges/authored"
  );

  assert.strictEqual(
    Code_Challenges_API("12345"),
    "https://www.codewars.com/api/v1/code-challenges/12345"
  );
});

