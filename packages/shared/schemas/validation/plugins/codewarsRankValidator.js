export function createCodewarsRankValidator() {
  const rankToNameMap = {
    '-8': '8 kyu',
    '-7': '7 kyu',
    '-6': '6 kyu',
    '-5': '5 kyu',
    '-4': '4 kyu',
    '-3': '3 kyu',
    '-2': '2 kyu',
    '-1': '1 kyu',
    1: '1 dan',
    2: '2 dan',
    3: '3 dan',
    4: '4 dan',
    5: '5 dan',
    6: '6 dan',
    7: '7 dan',
    8: '8 dan',
  };

  return function validateRankNameConsistency(data, path, errors) {
    if (data.rank !== undefined && data.name !== undefined) {
      const expectedName = rankToNameMap[data.rank.toString()];
      if (expectedName && data.name !== expectedName) {
        errors.push({
          path: path ? `${path}.name` : 'name',
          message: `Rank ${data.rank} should have name '${expectedName}', but got '${data.name}'`,
        });
      }
    }
  };
}
