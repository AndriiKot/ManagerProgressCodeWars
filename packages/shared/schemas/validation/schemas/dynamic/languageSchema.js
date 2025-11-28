export const createLanguageSchema = () => {
  return {
    type: 'object',
    required: ['rank', 'name', 'color', 'score'],
    properties: {
      rank: { 
        type: 'integer',
        minimum: -8,
        maximum: 8,
      },
      name: { 
        type: 'string',
        enum: [
          '8 kyu', '7 kyu', '6 kyu', '5 kyu', '4 kyu', '3 kyu', '2 kyu', '1 kyu',
          '1 dan', '2 dan', '3 dan', '4 dan', '5 dan', '6 dan', '7 dan', '8 dan',
        ], 
      },
      color: { type: 'string' },
      score: { 
        type: 'integer',
        positive: true,
        minimum: 0
      }
    }
  };
}