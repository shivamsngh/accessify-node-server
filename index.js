const DbService = require('./db/db.service');

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const router = express.Router();
const fileUpload = require('express-fileupload');
const db = new DbService();

//Parsing the body of incoming requests to JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

/**
 * Default funtion once the API is hit.
 * Runs for every request --TO BE DEPRECATED--
 */
router.use(function (req, res, next) {
    // do logging
    console.log('Magic is in the the Air.');
    //res.send("You should not be here");
    next(); // make sure we go to the next routes and don't stop here
});

/**
 * Get Alternate text for one IMAGE
 */
router.route('/getAltText').get((req, res) => {
    res.send('Ok I am working');
});

/**
 * Upload an image for image descrption
 * RESPONSE- IMAGE DESCRIPTION STRING
 */
router.route('/upload', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files;
    // Use the mv() method to place the file somewhere on your server
    //sampleFile.mv('/somewhere/on/your/server/.jpg', function(err) {
    console.log(sampleFile);
    if (err)
        return res.status(500).send(err);

    res.send('File uploaded!');

});

/**
 * Plugin API function for fetching Image description
 * RESPONSE- JSON file(String format) for a particulate domain
 * FILE Structure-
 * {
 *  "version":"VERSION_NUMBER",
 *  "domain":"URL",
 *  "region":"REGION/LANG of URL",
 *  "image_descriptions":[{"imageHashId":["PREDICTION 1",
 *  "PREDICTION2", "PREDICTION3"]}]
 *  }
 */
router.route('/getImageDescription').get((req, res) => {
    // if (req.query) {
    //     // Send error
    // }
    const domain = req.query.domain;
    const region = req.query.region;

    //  Check redis data base.
    let jsonData = {
        version: "VERSION_NUMBER",
        domain: "URL",
        region: "REGION/LANG of URL",
        image_descriptions: [{
            imageHashId: ["PREDICTION 1",
                "PREDICTION2", "PREDICTION3"]
        }]
    };
    db.storeJSONObjects(jsonData)
        .then(success => {
            db.getObjectsByDomainFromDb("URL")
                .then(alldata => res.status(200).send({ image_data: alldata }));
        })
        .catch(err => console.error('error in sotre obj', err));


});


// Append '/api' before each HTTP method
app.use('/api', router);

// Start local server
app.listen(3000, () => console.log('Example app listening on port 3000!'))
