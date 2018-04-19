
const CacheService = require('./cache.service');
const MongoService = require('./mongo.service');

class DbService {
    constructor() {
        this.cache = new CacheService();
        this.db = new MongoService();
    }

    /**
     * Find image data
     * @param {*} domain 
     * @param {*} region 
     */
    findImageData(domain, region = 'us') {
        return new Promise((resolve, reject) => {
            this.cache.findImageDataInCache(domain, region)
                .then(imageData => {
                    console.log("type of imagedata from redis", typeof imageData);
                    if (imageData === null || imageData === undefined || imageData.length === 0)
                        throw null;
                    resolve(imageData);
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
                            return reject(error);
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