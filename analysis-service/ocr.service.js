const Tesseract = require('tesseract.js');

class OcrService {
    constructor() { }
    getTextInImage(image) {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(image)
                // .progress(message => console.log(message))
                .catch(err => {
                    console.log("Error in tesseract", err);
                    resolve('');
                })
                .then(result => {
                    let finalText = result.text;
                    if (result.text.length > 20) {
                        finalText = '';
                    }
                    resolve(finalText);
                })
                .finally(resultOrError => console.log(resultOrError))
        });
    }
}

module.exports = OcrService;