'use strict';
const { dir } = console;

import { join } from 'node:path';
import { CodewarsAPI } from '#api';
import { saveUserProfileSync, saveUserRanksSync, saveUserSkillsSync } from '#sqlite';

const { getUserProfile } = CodewarsAPI;
const user = 'Krillan';

console.dir({ getUserProfile: getUserProfile.toString() });

const { data: getUserData } = await getUserProfile(user);
const ranks = getUserData.ranks;
const skills = getUserData.skills;


dir(getUserData.id);
saveUserProfileSync(getUserData);
saveUserRanksSync(ranks);
saveUserSkillsSync(skills);









