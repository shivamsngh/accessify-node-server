const redis = require('redis');
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(); //creates a new client


class CacheService {
    constructor() {
        client.on('connect', function () {
            console.log('redis connected');
        });
    }

    storeImageDataInCache(key, value) {
        value = JSON.stringify(value);
        return client.SADDAsync(key, value)
            .then(success => { console.log("Saved key") })
            .catch(error => {
                console.log("Error in saving key", error);
                Promise.reject(error);
            });
    }

    storeImageDataAsHashInCache(jsonObj) {
        // generate hash
        const domain = jsonObj.domain;
        console.log("domain", domain)
        jsonObj = JSON.stringify(jsonObj);
        return client.hmsetAsync(domain, jsonObj)
            .then(success => console.log("Success in hmset"))
            .catch(error => {
                console.error("Error in hmset", error);
                Promise.reject(error);
            });
    }

    findImageDataInCache(domain, region = 'us') {
        console.log("domain in get", domain);
        return client.smembersAsync(domain)
            .then((allObjects) => {
                console.log("All objects", allObjects);
                return allObjects;
            })
            .catch(error => {
                console.error("Data not available in cache", error);
                return Promise.resolve(null);
            });
    }
}
module.exports = CacheService;