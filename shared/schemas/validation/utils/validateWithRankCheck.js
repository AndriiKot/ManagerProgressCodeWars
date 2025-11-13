import { validateSchema } from '#schemas';
import { createCodewarsRankValidator } from '#schemas';

export function validateWithRankCheck({ schema, data, options = {}}) {
  const baseResult = validateSchema({ schema, data, options });

  if (!baseResult.isValid) {
    return baseResult;
  }

  const errors = [...baseResult.errors];
  const rankValidator = createCodewarsRankValidator();

  if (data.ranks && data.ranks.overall) {
    rankValidator(data.ranks.overall, 'ranks.overall', errors);
  }

  if (data.ranks && data.ranks.languages) {
    for (const [lang, langData] of Object.entries(data.ranks.languages)) {
      rankValidator(langData, `ranks.languages.${lang}`, errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
