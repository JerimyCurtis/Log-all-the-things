const express = require('express');
const fs = require('fs');
const app = express();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'log.csv',
    header: [
        { id: 'agent', title: 'Agent' },
    { id: 'time', title: 'Time' },
    { id: 'method', title: 'Method' },
    { id: 'resource', title: 'Resource' },
    { id: 'version', title: 'Version' },
    { id: 'status', title: 'Status' },
  ]
});

app.use((req, res, next) => {
// write your logging code here
const logEntry = {
    agent: req.headers['user-agent'],
    time: new Date().toISOString(),
    method: req.method,
    resource: req.originalUrl,
    version: req.httpVersion,
    status: res.statusCode,
  };
  csvWriter.writeRecords([logEntry]).then(() => {
    next();
  }).catch((error) => {
    console.error('Error writing log entry:', error);
    next();
  });
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

});

module.exports = app;
