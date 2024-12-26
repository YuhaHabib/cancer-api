const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

async function storeData(id, data) {
  const db = new Firestore({
    projectId: 'id project',
    keyFilename: path.resolve('./keypath.json'),
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

module.exports = storeData;