const req = require('request-promise');
const cheerio = require('cheerio');

class Scraper {
    constructor() { }

    loadSite(sitename) {
        const options = {
            uri: sitename,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        req(options)
            .then((doc) => {
                console.log($);
                this.doc = $;
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    }
}

module.exports = Scraper;