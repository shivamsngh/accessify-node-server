const ImageDescriptionService = require('./image-description.service');
const OcrService = require('./ocr.service');

class AnalysisService {
    constructor() {
        this.OCR = new OcrService();
        this.ImageDescription = new ImageDescriptionService();
    }

    /**
     * Gets image description from tensorflow service
     * @param {*} image : Image path on server
     */
    getImageCaption(image) {
        return new Promise((resolve, reject) => {
            this.ImageDescription.generateImageCaptions(image)
                .then((description) => {
                    resolve(description);
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Mock function for getImageCaption()
     */
    getMockCaption() {
        return Promise.resolve(`I am feeling lucky`);
    }

    /**
     * Method for calling OCR function from service,
     * @param {*} image 
     */
    getOcrText(image) {
        return this.OCR.getTextInImage(image)
            .then((text) => {
                if (text.length) {
                    return text;
                }
                else return null
            })
            .catch(err => {
                console.log("Error in OCR", err);
                return null;
            })
    }

    /**
     * Service level function for getting text in an image
     * @param {*} image : Path to image on server
     */
    getGeneratedText(image) {
        return this.getMockCaption().then(captionText => {
            return this.getOcrText(image)
                .then((OcrText) => {
                    let resp = `The image might contain ${captionText}`;
                    resp = OcrText !== null ? `${resp} and has some text as \n ${OcrText}` : resp;
                    // console.log("In getGeneratedText",OcrText);
                    return resp;
                })
                .catch(err => console.log("Error in getOcrText", err));
        })
            .catch(err => console.log("Error in getMockCaption", err));
    }
}

module.exports = AnalysisService;