
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

    storeSimpleKeyValueInCahe(key, value) {
        return client.setAsync(['framework', 'AngularJS'])
            .then(success => { console.log("Saved key") })
            .catch(error => {
                console.log("Error in saving key", error);
                Promise.reject(error);
            });
    }

    storeJSONObjectsInCache(jsonObj) {
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

    getObjectsByDomainFrom(domain) {
        console.log("domain in get", domain);
        return client.HGETALLAsync(domain)
            .then((allObjects) => {
                console.log("All objects", allObjects);
                return allObjects;
            })
            .catch(error => console.error("error in getallobj", error));
    }
}
module.exports = CacheService;