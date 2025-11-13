import { CodewarsAPI } from '#api';

export const userAuthoredSchema = {
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'description', 'rank', 'rankName', 'tags', 'languages'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          rank: { type: ['integer', 'null'] },       
          rankName: { type: ['string', 'null'] },    
          tags: { type: 'array', items: { type: 'string' } },
          languages: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    },
  },
};

