const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const router = express.Router();
const fileUpload = require('express-fileupload');

//Parsing the body of incoming requests to JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());


router.use(function (req, res, next) {
    // do logging
    console.log('Magic is in the the Air.');
//res.send("You should not be here");
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/getAltText').get((req, res) => {
res.send('Ok I am working');
});

router.route('/upload',(req,res)=>{
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


app.use('/api', router);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
