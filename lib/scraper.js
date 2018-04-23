const download = require('image-downloader');
const fse = require('fs-extra');
const lib = require('./regex');
const Jimp = require("jimp");


class Scraper {
    constructor() { }

    /**
     * Removed support for cheerio loadsite since 
     * the plugin does not produce proper
     * tags as a broeser.
     * Instead in the new approach, 
     * the image file going to be 
     * genrated is directly taken
     * from the first browser requests. 
     * Then the integrity check is performed 
     * andn if that fails a fresh request is made
     * to the server.s
     * @param {*} sitename 
     */
    // loadSite(sitename) {
    //     const options = {
    //         uri: sitename,
    //         transform: function (body) {
    //             return cheerio.load(body);
    //         }
    //     };
    //     return new Promise((resolve, reject) => {
    //         req(options)
    //             .then((doc) => {
    //                 console.log("image length", doc('img').length);
    //                 fse.ensureDir(`image-data/${lib.getHostName(sitename)}`).then(success => this.asyncForEach(doc('img'), sitename, doc, resolve)).catch(e => console.log("error in creating dir", e))
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 reject(err);
    //             });
    //     });
    // }

    /**
     * Send image data from browser
     * @param {*} sitename 
     * @param {*} imageArrayFromBrowser 
     */
    loadSiteFromBrowserArray(sitename, imageArrayFromBrowser) {
        return new Promise((resolve, reject) => {
            fse.ensureDir(`image-data/${lib.getHostName(sitename)}`).then(success => this.asyncForEachNew(imageArrayFromBrowser, sitename, resolve)).catch(e => console.log("error in creating dir", e))
        })
            .catch((err) => {
                console.log(err);
                reject(err);
            });

    }

    async  asyncForEachNew(array, sitename, callback) {
        const imgArr = [];
        console.log(" Image array length", array.length);
        for (let index = 0; index < array.length; index++) {
            //   await callback(array[index], index, array)
            const imgUri = array[index].imgUri;
            const opts = {
                url: this.checkIfValidUri(imgUri) ? imgUri : `${sitename}${imgUri}`,
                dest: `image-data/${lib.getHostName(sitename)}`               // Save to /path/to/dest/image.jpg
            }
            try {
                let filename = await this.downloadIMG(opts);
                console.log("image url", array[index].imgUri);
                filename = await this.convertImageToJPG(filename);
                imgArr.push({ sitename, imgUri, filename });
            } catch (error) {
                let filename = '';
                imgArr.push({ sitename, imgUri, filename });
            }

        }
        console.log("Image array from server", imgArr);
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