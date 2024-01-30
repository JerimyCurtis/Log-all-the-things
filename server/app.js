const express = require('express');
const fs = require('fs');
const app = express();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvtojson = require('csvtojson');

const csvWriter = createCsvWriter({
    path: 'log.csv',
    header: [
        { id: 'user-agent', title: 'Agent' },
        { id: 'time', title: 'Time' },
        { id: 'method', title: 'Method' },
        { id: 'resource', title: 'Resource' },
        { id: 'version', title: 'Version' },
        { id: 'status', title: 'Status' },
    ],
});

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        // Construct the log string
        const logString = [
            req.headers['user-agent'] || 'node-superagent', // Fallback to 'node-superagent'
            new Date().toISOString(),                       // ISO date
            req.method,                                    // HTTP method
            req.originalUrl,                               // URL
            'HTTP/' + req.httpVersion,                     // HTTP version
            res.statusCode                                 // Status code
        ].join(',');

        console.log(logString); // Log the string
        originalSend.apply(res, arguments);
    };

    next();
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    const csvFilePath = 'log.csv'; // Path to your CSV file

    csvtojson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            res.json(jsonObj); // Send JSON response
        })
        .catch((err) => {
            console.error('Error reading or parsing log file:', err);
            res.status(500).send('Error processing log file');
        });
});

module.exports = app;
