
const CacheService = require('./cache.service');
const MongoService = require('./mongo.service');
const AnalysisService = require('../analysis-service/analysis.service')

class DbService {
    constructor() {
        this.cache = new CacheService();
        this.db = new MongoService();
        this.analysis = new AnalysisService();
    }

    /**
     * Find image data
     * @param {*} domain 
     * @param {*} region 
     */
    findImageData(domain, region = 'us', imageArrayFromBrowser) {
        return new Promise((resolve, reject) => {
            this.cache.findImageDataInCache(domain, region)
                .then(image_data => {
                    console.log("type of imagedata from redis", typeof imageData);
                    if (image_data === null || image_data === undefined || image_data.length === 0)
                        throw null;
                    resolve(image_data);
                })
                .catch(error => {
                    console.log("Image Data Not found in cache", error);
                    this.db.findImageDataInDb(domain, region)
                        .then(imgData => {
                            // Save to cache
                            console.log("domain in store db", domain, "imgdata", imgData);
                            this.cache.storeImageDataInCache(domain, imgData);
                            return resolve(imgData);
                        })
                        .catch(error => {
                            console.log(`Image data not found in Db, generating data for ${domain}${region}.`, error);
                            this.analysis.generateImageCaptionsForSite(domain, imageArrayFromBrowser).then((successFile) => {
                                console.log("success file in db ", successFile);
                                const mainVersioningFile = { version: 1, domain: domain, image_data: successFile };
                                this.db.createImageDataInDb(mainVersioningFile).then(success => this.cache.storeImageDataInCache(domain, mainVersioningFile));
                                resolve(mainVersioningFile);
                            })
                                .catch(error => reject(error))
                        });
                });
        });
    }

    storeImageDataInDb(imageData) {
        return this.db.createImageDataInDb(imageData)
            .then(success => {
                return success;
            })
            .catch(err => {
                console.log("Error saving in mongo db", err);
                return Promise.reject(err);
            });
    }
}
module.exports = DbService;