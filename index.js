const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const recordsService = require('./services/recordsService');
const { validateIncomingRequest } = require('./components/validateIncomingRequest');

// Loading Configuration settings
const config = require('./config');

// Loading MongoDB URL
const dbURL = config.getDBURL();

// Port Configuration
const port = config.getPort();

// MongoDB connection
mongoose
    .connect(dbURL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Error connecting to MongoDB: ", err));

// Express app creation
const app = express();

// Parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

/*
    Possible values for 'code' in response object and it's meaning:
    0 -> Request payload is in valid format
    1 -> Request payload is not in valid format
    2 -> Start date is more than End date
    3 -> Min count is more than Max count
    4 -> Both cases 2 & 3
    5 -> No proper Aggregation pipeline generated to query
    6 -> Error occured while executing Aggregation pipeline
    7 -> Error while parsing request payload
*/

app.post('/getRecords', async function (req, res) {

    /* 
        Create Response Object template
        code, msg and records attributes
    */
    let responseObject = {
        "code": -1,
        "msg": "response payload message",
        "records": []
    };

    /* Incoming body/request payload should be in below format: 
        {
            startDate: "2017-01-01",
            endDate: "2020-01-28",
            minCount: 0,
            maxCount: 170
        }; 
        validateIncomingRequest function will determine if payload is matching the expected format
    */
    let canProceed = validateIncomingRequest(req.body);
    responseObject.code = canProceed;

    if (canProceed === 0) {
        const filters = req.body;
        responseObject.msg = "Success";
        let records = await recordsService.getRecords(filters);
        if (records !== undefined && records.length > 0) {
            responseObject.records = records;
            res.status(200).json(responseObject);
        }
        else {
            if (records !== undefined) {
                if (records[0] === 5) {
                    responseObject.code = records[0];
                    responseObject.msg = "No proper Aggregation pipeline generated to query";
                }
                if (records[0] === 6) {
                    responseObject.code = records[0];
                    responseObject.msg = "Error occured while executing Aggregation pipeline";
                }
                res.status(400).json(responseObject);
            }
        }
    }
    if (canProceed === 1) {
        responseObject.msg = "Invalid request payload, can't proceed";
        res.status(400).json(responseObject);
    }
    if (canProceed === 2) {
        responseObject.msg = "Invalid request payload: Start date is more than End date";
        res.status(400).json(responseObject);
    }
    if (canProceed === 3) {
        responseObject.msg = "Invalid request payload: Min count is more than Max count";
        res.status(400).json(responseObject);
    }
    if (canProceed === 4) {
        responseObject.msg = "Invalid request payload: Start date is more than End date & Min count is more than Max count";
        res.status(400).json(responseObject);
    }
});

app.listen(port, () => {
    console.log(`API listening on port: ${port}`);
});

// Error Handling
app.use(function (err, req, res, next) {
    let responseObject = {
        "code": 7,
        "msg": 'Error while parsing request payload. Error: ' + err.message,
        "records": []
    };
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(responseObject);
});

process.stdin.resume(); // make sure program doesn't close instantly

function exitHandler(options, exitCode) {
    mongoose.connection.close();
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// When app closes
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// Catch CTRL + C event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// Catch Uncaught Exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

// Catch "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));