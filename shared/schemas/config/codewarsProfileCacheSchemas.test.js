import { CodewarsProfileCacheSchemas } from "./codewarsProfileCacheSchemas.js";

const testCodewarsProfileCacheSchemas = () => {
  const schemas = CodewarsProfileCacheSchemas;

  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  const expectedKeys = [
    "Ranks",
    "Position",
    "AuthoredKatasCount",
    "UniquesKatas",
    "Honor",
  ];

  assert(
    JSON.stringify(Object.keys(schemas)) === JSON.stringify(expectedKeys),
    "testCodewarsProfileCacheSchemas: Keys do not match expected keys"
  );

  assert(Object.isFrozen(schemas), "Schemas object is not frozen");
  for (const key of expectedKeys) {
    assert(
      Object.isFrozen(schemas[key]),
      `Schemas sub-object '${key}' is not frozen`
    );
  }

  assert(schemas.Ranks.field === "ranks", "Ranks field incorrect");
  assert(schemas.Position.field === "leaderboardPosition", "Position field incorrect");
  assert(schemas.AuthoredKatasCount.field === "codeChallenges.totalAuthored", "AuthoredKatasCount field incorrect");
  assert(schemas.UniquesKatas.field === "codeChallenges.totalCompleted", "UniquesKatas field incorrect");
  assert(schemas.Honor.field === "honor", "Honor field incorrect");

  assert(schemas.Ranks.useCryptoHash === true, "Ranks useCryptoHash should be true");
  assert(schemas.Position.useCryptoHash === false, "Position useCryptoHash should be false");
  assert(schemas.AuthoredKatasCount.useCryptoHash === false, "AuthoredKatasCount useCryptoHash should be false");
  assert(schemas.UniquesKatas.useCryptoHash === false, "UniquesKatas useCryptoHash should be false");
  assert(schemas.Honor.useCryptoHash === false, "Honor useCryptoHash should be false");

  console.log("✅ testCodewarsProfileCacheSchemas passed");
};

testCodewarsProfileCacheSchemas();
