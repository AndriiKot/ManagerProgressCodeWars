import { join } from "node:path";
import { makeCodewarsCacheSchemas } from "./makeCodewarsCacheSchemas.js";

const testMakeCodewarsCacheSchemas = () => {
  const basePath = "/tmp/codewars";
  const schemas = makeCodewarsCacheSchemas(basePath);

  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  const expectedKeys = [
    "Ranks",
    "Position",
    "AuthoredKatasCount",
    "Honor",
    "UniquesKatas",
    "PagesCodeChallenges",
    "KatasCodeChallenges",
  ];
  assert(JSON.stringify(Object.keys(schemas)) === JSON.stringify(expectedKeys), "testMakeCodewarsCacheSchemas: Keys do not match expected keys");

  assert(schemas.Ranks.file === join(basePath, "ranks.json"), "testMakeCodewarsCacheSchemas: Ranks path incorrect");
  assert(schemas.Position.file === join(basePath, "position.json"), "testMakeCodewarsCacheSchemas: Position path incorrect");
  assert(schemas.AuthoredKatasCount.file === join(basePath, "authored-katas-count.json"), "testMakeCodewarsCacheSchemas: AuthoredKatasCount path incorrect");

  assert(Object.isFrozen(schemas), "testMakeCodewarsCacheSchemas: Schemas object is not frozen");
  assert(Object.isFrozen(schemas.Ranks), "testMakeCodewarsCacheSchemas: Ranks object is not frozen");
  assert(Object.isFrozen(schemas.Position), "testMakeCodewarsCacheSchemas: Position object is not frozen");

  assert(schemas.Ranks.useCryptoHash === true, "testMakeCodewarsCacheSchemas: Ranks useCryptoHash should be true");
  assert(schemas.Position.useCryptoHash === false, "testMakeCodewarsCacheSchemas: Position useCryptoHash should be false");
  assert(schemas.PagesCodeChallenges.useCryptoHash === true, "testMakeCodewarsCacheSchemas: PagesCodeChallenges useCryptoHash should be true");

  console.log("testMakeCodewarsCacheSchemas passed ✅");
};

testMakeCodewarsCacheSchemas();
