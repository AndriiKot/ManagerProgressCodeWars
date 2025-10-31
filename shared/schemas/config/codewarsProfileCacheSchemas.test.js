import { CodewarsProfileCacheSchemas } from "./codewarsProfileCacheSchemas.js";

const testCodewarsProfileCacheSchemas = () => {
  const schemas = CodewarsProfileCacheSchemas;

  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  assert(Object.isFrozen(schemas), "Schemas object is not frozen");
  assert(Array.isArray(schemas.fields), "'fields' must be an array");
  assert(
    JSON.stringify(schemas.fields) ===
      JSON.stringify([
        "honor",
        "clan",
        "leaderboardPosition",
        "codeChallenges.totalAuthored",
        "codeChallenges.totalCompleted",
      ]),
    "'fields' content does not match expected values"
  );

  assert(
    typeof schemas.fieldsUseHash === "object" && schemas.fieldsUseHash !== null,
    "'fieldsUseHash' must be an object"
  );

  assert("0" in schemas.fieldsUseHash && "1" in schemas.fieldsUseHash, "'fieldsUseHash' must have keys '0' and '1'");

  const level0 = schemas.fieldsUseHash[0];
  const level1 = schemas.fieldsUseHash[1];

  assert(level0 && typeof level0 === "object", "fieldsUseHash[0] must be object or set");
  assert(level1 && typeof level1 === "object", "fieldsUseHash[1] must be object or set");

  const level0Expected = ["ranks"];
  const level1Expected = ["ranks.overall", "ranks.languages"];

  assert(
    JSON.stringify(Object.values(level0)) === JSON.stringify(level0Expected) ||
      JSON.stringify(Object.keys(level0)) === JSON.stringify(level0Expected),
    "fieldsUseHash[0] does not match expected fields"
  );

  assert(
    JSON.stringify(Object.values(level1)) === JSON.stringify(level1Expected) ||
      JSON.stringify(Object.keys(level1)) === JSON.stringify(level1Expected),
    "fieldsUseHash[1] does not match expected fields"
  );

  assert(Object.isFrozen(schemas.fields), "'fields' array is not frozen");
  assert(Object.isFrozen(schemas.fieldsUseHash), "'fieldsUseHash' object is not frozen");

  console.log("✅ testCodewarsProfileCacheSchemas passed");
};

testCodewarsProfileCacheSchemas();
