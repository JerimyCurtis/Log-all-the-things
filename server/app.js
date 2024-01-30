const express = require('express');
const csvtojson = require('csvtojson');
const app = express();

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        console.log([
            req.headers['user-agent'] || 'node-superagent', 
            new Date().toISOString(), 
            req.method, 
            req.originalUrl, 
            `HTTP/${req.httpVersion}`, 
            res.statusCode
        ].join(','));
        originalSend.apply(res, arguments);
    };
    next();
});

app.get('/', (req, res) => res.status(200).send('ok'));

app.get('/logs', (req, res) => {
    csvtojson()
        .fromFile('log.csv')
        .then(jsonObj => res.json(jsonObj))
        .catch(err => {
            console.error('Error reading or parsing log file:', err);
            res.status(500).send('Error processing log file');
        });
});

module.exports = app;
