'use strict';
const { dir } = console;

import { join } from 'node:path';
import { CodewarsAPI } from '#api';
import { saveFullUser } from '#sqlite';
import { initTestDatabase } from './init.js';

const db = initTestDatabase(); 
const { getUserProfile } = CodewarsAPI;
const user = 'Krillan';


console.dir({ getUserProfile: getUserProfile.toString() });

const { data: getUserData } = await getUserProfile(user);

const idDBUser = saveFullUser(db, getUserData);

// check user data
const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(idDBUser);
console.log('User row:', userRow);

const ranks = db.prepare('SELECT * FROM user_ranks WHERE user_id = ?').all(idDBUser);
console.log('User ranks:', ranks);

const skills = db.prepare('SELECT * FROM user_skills WHERE user_id = ?').all(idDBUser);
console.log('User skills:', skills);










