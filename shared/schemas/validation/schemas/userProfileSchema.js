import { createLanguageSchema } from './languageSchema.js';

export const userProfileSchema = {
  type: 'object',
  required: ['id', 'username', 'honor', 'ranks', 'codeChallenges', 'leaderboardPosition'],
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    name: { type: 'string' },
    honor: { 
      type: 'integer', 
      positive: true,
      minimum: 0
    },
    clan: { type: 'string' },
    leaderboardPosition: { 
      type: 'integer',  
      positive: true,
      minimum: 1
    },
    skills: { 
      type: 'array',
      items: { type: 'string' }
    },
    ranks: {
      type: 'object',
      required: ['overall', 'languages'],
      properties: {
        overall: {
          type: 'object',
          required: ['rank', 'name', 'color', 'score'],
          properties: {
            rank: { 
              type: 'integer', 
              positive: true,
              minimum: 1
            },
            name: { 
              type: 'string',
              enum: [
                '8 kyu', '7 kyu', '6 kyu', '5 kyu', '4 kyu', '3 kyu', '2 kyu', '1 kyu',
                '1 dan', '2 dan', '3 dan',
              ], 
            },
            color: { type: 'string' },
            score: { 
              type: 'integer',  
              positive: true,
              minimum: 0
            }
          }
        },
        languages: {
          type: 'object',
          additionalProperties: createLanguageSchema()
        }
      }
    },
    codeChallenges: {
      type: 'object',
      required: ['totalAuthored', 'totalCompleted'],
      properties: {
        totalAuthored: { 
          type: 'integer',  
          positive: true,
          minimum: 0
        },
        totalCompleted: { 
          type: 'integer',  
          positive: true,
          minimum: 0
        }
      }
    }
  }
};