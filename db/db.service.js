const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/textmonkey';
const CacheService = require('./cache.service');

class DbService {
    constructor() {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw 'Error connecting to database - ' + err;
            else console.log("connected");
        });
        this.cache = new CacheService();
    }
}
module.exports = DbService;