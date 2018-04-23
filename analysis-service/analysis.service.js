const ImageDescriptionService = require('./image-description.service');
const OcrService = require('./ocr.service');
const Scraper = require('../lib/scraper');
const fse = require('fs-extra')

class AnalysisService {
    constructor() {
        this.OCR = new OcrService();
        this.ImageDescription = new ImageDescriptionService();
        this.scrape = new Scraper();
    }

    /**
     * PRIVATE
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
     * TEST
     * Mock function for getImageCaption()
     */
    getMockCaption() {
        return Promise.resolve(`I am feeling lucky`);
    }

    /**
     * PRIVATE
     * Method for calling OCR function from service,
     * @param {*} image 
     */
    getOcrText(image) {
        // return this.OCR.getTextInImage(image)
        //     .then((text) => {
        //         if (text.length) {
        //             return text;
        //         }
        //         else return null
        //     })
        //     .catch(err => {
        //         console.log("Error in OCR", err);
        //         return null;
        //     })

        // Dropped OCr service in favour of speed in first iteration

        return Promise.resolve('');
    }

    /**
     * PUBLIC
     * Service level function for getting text in an image
     * @param {*} image : Path to image on server
     */
    getGeneratedText(image) {
        return this.getImageCaption(image).then(captionText => {
            return this.getOcrText(image)
                .then((OcrText) => {
                    if (captionText) {
                        let resp = `The image might contain ${captionText}`;
                        resp = OcrText !== null ? `${resp} and has some text as \n ${OcrText}` : resp;
                        // console.log("In getGeneratedText",OcrText);
                        return resp;
                    }
                    else {
                        return '';
                    }

                })
                .catch(err => {
                    console.log("Error in getOcrText", err);
                    return '';
                });
        })
            .catch(err => {
                console.log("Error in getMockCaption", err);
                return '';
            });
    }

    generateImageCaptionsForSite(siteName, imageArrayFromBrowser) {
        return new Promise((resolve, reject) => {
            this.scrape.loadSiteFromBrowserArray(siteName, imageArrayFromBrowser).then(imageArray => {
                console.log("imageArray object", imageArray);
                console.log("imageArrayFromBrowser object", imageArrayFromBrowser);
                this.asyncForEach(imageArray, siteName, resolve);
            })
                .catch(e => reject(e))
        })

    }

    async  asyncForEach(array, sitename, callback) {
        const newArr = [];
        for (let index = 0; index < array.length; index++) {
            const ImageDesc = await this.getGeneratedText(array[index].filename);
            newArr.push({ ...array[index], ImageDesc });
        }
        console.log("new array with image dsc", newArr);
        // Delete contents of image-data folder
        fse.remove(`image-data/${sitename}`);
        callback(newArr);
    }
}

module.exports = AnalysisService;