const userProfileSchema = {
  type: 'object',
  required: ['id', 'username', 'honor', 'ranks', 'codeChallenges'],
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    name: { type: 'string' },
    honor: { type: 'number' },
    clan: { type: 'string' },
    leaderboardPosition: { type: 'number' },
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
            rank: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            score: { type: 'number' }
          }
        },
        languages: {
          type: 'object',
          properties: {
            ruby: {
              type: 'object',
              properties: {
                rank: { type: 'number' },
                name: { type: 'string' },
                color: { type: 'string' },
                score: { type: 'number' }
              }
            }
            // ... остальные языки
          }
        }
      }
    },
    codeChallenges: {
      type: 'object',
      required: ['totalAuthored', 'totalCompleted'],
      properties: {
        totalAuthored: { type: 'number' },
        totalCompleted: { type: 'number' }
      }
    }
  }
};

// Валидация с рекурсией
const validationResult = validateSchema(userProfileSchema, apiResponse, {
  recursive: true,
  strict: false
});

if (validationResult.isValid) {
  console.log('✅ Данные валидны!');
} else {
  console.log('❌ Ошибки валидации:');
  validationResult.errors.forEach(error => {
    console.log(`  ${error.path}: ${error.message}`);
  });
}