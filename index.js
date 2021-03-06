const DbService = require('./db-service/db.service');
const AnlaysisService = require('./analysis-service/analysis.service');

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const router = express.Router();
const fileUpload = require('express-fileupload');
const db = new DbService();
const analysis = new AnlaysisService();

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
 */
router.route('/getImageDescription').get((req, res) => {
    const domain = req.query.domain;
    const region = req.query.region;
    const imageArrayFromBrowser = JSON.parse(req.query.imageArrayFromBrowser);

    console.log("host url in req", domain);
    console.log("image array browser url in req", imageArrayFromBrowser);
    db.findImageData(domain, region, imageArrayFromBrowser)
        .catch(err => {
            console.error("Error in findImagedata", err);
            res.status(400).send(err);
        })
        .then(imageData => {
            res.status(200).send(imageData);
        });
});

router.route('/getImageDescription').post((req, res) => {
    const domain = req.body.domain;
    const region = req.body.region;
    const imageArrayFromBrowser = JSON.parse(req.body.imageArrayFromBrowser);

    console.log("host url in req", domain);
    console.log("image array browser url in req", imageArrayFromBrowser);
    db.findImageData(domain, region, imageArrayFromBrowser)
        .catch(err => {
            console.error("Error in findImagedata", err);
            res.status(400).send(err);
        })
        .then(imageData => {
            res.status(200).send(imageData);
        });
});

// Route 2- Generate Image Data form image
router.route('/generateImageData').get((req, res) => {
    analysis.getGeneratedText('test-images/test1.jpg')
        .then((description) => {
            console.log("in route", description);
            res.status(200).send(description);
        })
        .catch(err => {
            console.log("Error in sending response", err);
            res.status(400).send(err);
        });
});


// Append '/api' before each HTTP method
app.use('/api', router);

// Start local server
app.listen(3000, () => console.log('Accessify listening on port 3000!'))
