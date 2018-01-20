const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/';

class MongoService {
    constructor() {
        MongoClient.connect(mongoUrl, (err, client) => {
            if (err) throw 'Error connecting to database - ' + err;
            else console.log("Mongo db connected");
            this.db = client.db('accessifydb');
        });
    }

    createImageDataInDb(imageDataObj) {
        return new Promise((resolve, reject) => {
            console.log("Image data domain", imageDataObj.domain);
            this.db.collection(imageDataObj.domain).save({
                version: imageDataObj.version,
                domain: imageDataObj.domain,
                image_data: imageDataObj.image_descriptions
            }, (err, success) => {
                if (err) reject(err);
                resolve(success);
            })
        })
    }

    findImageDataInDb(domain, region = 'us') {
        return new Promise((resolve, reject) => {
            this.db.collection(domain).findOne({
            }, (err, doc) => {
                console.log("mongo doc", doc);
                if (err || !doc) reject(null);
                
                else resolve(doc);
            });
        })
    }
}
module.exports = MongoService;