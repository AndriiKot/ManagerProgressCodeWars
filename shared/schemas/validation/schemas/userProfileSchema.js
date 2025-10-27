import { createLanguageSchema } from './languageSchema.js';

export const userProfileSchema = {
  type: 'object',
  required: ['id', 'username', 'honor', 'ranks', 'codeChallenges'],
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
                '1 dan', '2 dan', '3 dan', '4 dan', '5 dan', '6 dan', '7 dan', '8 dan'
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