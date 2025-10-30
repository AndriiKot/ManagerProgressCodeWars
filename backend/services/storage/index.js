import { loadJSONAsObject, writeObjectToJSON } from './utils/index.js';

export const Storage = {
  async update({ user, data }) {
    console.log('update Storage');
    console.log(user);
    console.log(data);
  },

  async load(pathFile) {
    console.log('test load fn');
    loadJSONAsObject(pathFile); 
  },

  async write({ filePath, data }) {
    console.log('test write fn');
    writeObjectToJSON({ filePath, dataObject: data });
  },

};

const testWrite = await Storage.write({ filePath: './storage-test.json', data: { "name": "Andrii", "age": 39 }});
const testLoas = await Storage.load('./storage-test.json');