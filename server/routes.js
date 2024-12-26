const { savePrediction, getPredictionHistories } = require('../services/storeData');
const { predictClassification } = require('../services/InferenceService');
const multer = require('multer');
const InputError = require('../exceptions/InputError');


const upload = multer({ limits: { fileSize: 1000000 } }); 

module.exports = [
    {
        method: 'POST',
        path: '/predict',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
            },
        },
        handler: upload.single('image'), 
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: async (request, h) => {
            try {
                const histories = await getPredictionHistories();
                return h.response({
                    status: 'success',
                    data: histories,
                }).code(200);
            } catch (error) {
                return h.response({
                    status: 'fail',
                    message: 'Failed to retrieve prediction histories.',
                }).code(500);
            }
        },
    },
];


module.exports[0].handler = async (request, h) => {
    try {
        const { payload } = request;
        const file = payload.image;

        if (!file || !file.hapi.filename) {
            throw new InputError('Image is required.');
        }

        const buffer = await file._data; 
        const model = request.server.app.model; 
        const prediction = await predictClassification(model, buffer); 

        const response = await savePrediction({
            id: prediction.id, 
            result: prediction.label,
            suggestion: prediction.suggestion,
            createdAt: new Date().toISOString(),
        });

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: response,
        }).code(200);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: error.message,
        }).code(error.statusCode || 500);
    }
};