import { CodewarsAPI } from '#api';
import { validateSchema } from '#schemas';

const { getAuthoredChallenges } = CodewarsAPI;


export const userAuthoredSchema = {
  type: 'object',
  required: ['data'],
  properties: {
    data: { type: 'array' },
  },
};

const { data } = await getAuthoredChallenges('Krillan');

console.log(data);

