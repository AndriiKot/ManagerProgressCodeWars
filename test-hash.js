import { getProfile } from './api/codewarsAPI.js';
import { hasChanged } from './services/hash/index.js';
import { USER_FIELDS } from './services/hash/fieldSelectors.js';

const username = 'AndriiKot';
const res = await fetch(getProfile(username)); 
const profileData = await res.json();

if (hasChanged(`user-${username}`, profileData, USER_FIELDS)) {
  console.log('Профиль изменился! Сохраняем данные и обновляем DB...');
} else {
  console.log('Изменений нет.');
}
