const exec = require('child_process').exec;

class DescriptionService {
    constructor() { }

    /**
     * Calls image description service
     * as a child process on server
     * @param {*} imageName 
     */
    generateImageCaptions(imageName) {
        return new Promise((resolve, reject) => {
            let image = imageName;
            let scpt = exec(`sh ../shellscripts/tensrscpt.sh ${image}`, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                resolve(this.extractHighlyProbableOutput(stdout));
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                    reject(error);
                }
            });
        });
    }

    extractHighlyProbableOutput(stringInput) {
        return stringInput.match(/0\).*\(p/)[0].replace('0)', '');
    }
}

module.exports = DescriptionService;
