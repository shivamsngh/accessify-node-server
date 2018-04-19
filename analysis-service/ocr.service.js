const Tesseract = require('tesseract.js');

class OcrService {
    constructor() { }
    getTextInImage(image) {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(image)
                .progress(message => console.log(message))
                .catch(err => {
                    console.log("Error in tesseract", err);
                    reject(err);
                })
                .then(result => resolve(result.text))
                .finally(resultOrError => console.log(resultOrError))
        });
    }
}

module.exports = OcrService;