import { validateWithRankCheck, userProfileSchema } from '#schemas';

const apiResponse = {
  id: "625dae5f8f66eb001c7ef330",
  username: "Krillan",
  name: "",
  honor: 29699,  
  clan: "",
  leaderboardPosition: 174,
  skills: [],
  ranks: {
    overall: {
      rank: 2,        
      name: "3 dan",  // 👈 ОШИБКА: должно быть "2 dan"
      color: "black",
      score: 38060
    },
    languages: {
      ruby: {
        rank: -1,
        name: "1 kyu",  
        color: "purple",
        score: 28600
      },
      sql: {
        rank: -8,
        name: "7 kyu",  // 👈 ОШИБКА: должно быть "8 kyu"
        color: "blue",
        score: 3015
      },
      javascript: {
        rank: -2,
        name: "2 kyu",  
        color: "purple",
        score: 6801 
      },
      shell: {
        rank: -6,  
        name: "5 kyu",  // 👈 ОШИБКА: должно быть "6 kyu" 
        color: "yellow", 
        score: 416
      },
      python: {  
        rank: 2,        
        name: "3 dan",  // 👈 ОШИБКА: должно быть "2 dan"
        color: "green",
        score: 4500
      }
    }
  },
  codeChallenges: {
    totalAuthored: 2,
    totalCompleted: 4377
  }
};

const validationResult = validateWithRankCheck(userProfileSchema, apiResponse, {
  recursive: true,
  strict: true
});

if (validationResult.isValid) {
  console.log('✅ Данные валидны!');
} else {
  console.log('❌ Ошибки валидации:');
  validationResult.errors.forEach(error => {
    console.log(`  ${error.path}: ${error.message}`);
  });
}