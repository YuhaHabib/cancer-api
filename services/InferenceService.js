const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeImage(image)
            .resizeBilinear([224, 224])
            .expandDims()
            .toFloat(); 

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

        let suggestion = label === "Cancer" 
            ? "Segera periksakan diri ke dokter." 
            : "Penyakit kanker tidak terdeteksi.";

        return {
            confidenceScore,
            label,
            suggestion,
        };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
    }
}

module.exports = predictClassification;