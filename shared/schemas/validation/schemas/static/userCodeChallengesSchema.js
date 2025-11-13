export const userCodeChallengesSchema = {
  type: 'object',
  required: ['totalPages', 'totalItems', 'data'],
  properties: {
    totalPages: { 
      type: 'integer',
      minimum: 0, 
    },
    totalItems: { 
      type: 'integer',
      minimum: 0,
    },
    data: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'slug', 'completedLanguages', 'completedAt'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          completedLanguages: {
            type: 'array',
            items: { type: 'string' },
          },
          completedAt: { type: 'string', format: 'date-time' },
        },
        additionalProperties: false,
      },
    },
  },
};
