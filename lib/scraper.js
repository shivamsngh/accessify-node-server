const req = require('request-promise');
const cheerio = require('cheerio');
const download = require('image-downloader');
const fse = require('fs-extra');
const lib = require('./regex');
const Jimp = require("jimp");

class Scraper {
    constructor() {
    }

    loadSite(sitename) {
        const options = {
            uri: sitename,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        return new Promise((resolve, reject) => {
            req(options)
                .then((doc) => {
                    fse.ensureDir(`image-data/${lib.getHostName(sitename)}`).then(success => this.asyncForEach(doc('img'), sitename, doc, resolve)).catch(e => console.log("error in creating dir", e))
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    async  asyncForEach(array, sitename, doc, callback) {
        const imgArr = [];

        for (let index = 0; index < array.length; index++) {
            //   await callback(array[index], index, array)
            const imgUri = doc(array[index]).attr('src');
            const opts = {
                url: this.checkIfValidUri(imgUri) ? imgUri : `${sitename}${imgUri}`,
                dest: `image-data/${lib.getHostName(sitename)}`               // Save to /path/to/dest/image.jpg
            }
            let filename = await this.downloadIMG(opts);
            console.log("image url", doc(array[index]).attr('src'));
            filename = await this.convertImageToJPG(filename);
            imgArr.push({ sitename, imgUri, filename });
        }
        callback(imgArr);
    }

    async downloadIMG(options) {
        try {
            const { filename, image } = await download.image(options)
            return filename;
        } catch (e) {
            console.log("error in download", e);
            return null;
        }
    }

    checkIfValidUri(uri) {
        // console.log("uri in q", uri);
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(uri);
    }

    async convertImageToJPG(filePath) {
        if (/\.png/i.test(filePath)) {
            let temp_path = filePath.replace('.png', '.jpg');
            return Jimp.read(filePath).then(lenna => {
                lenna.quality(100)                 // set JPEG quality
                    .write(temp_path);
                return temp_path;// save
            })
                .catch(e => {
                    console.error(err);
                    return filePath;
                });
        }
        else {
            return filePath;
        }
    }
}

module.exports = Scraper;