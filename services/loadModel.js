const tf = require('@tensorflow/tfjs-node'); 

async function loadModel() {
    return tf.loadGraphModel('link model');
}

module.exports = loadModel;