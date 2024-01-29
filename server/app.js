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
    fs.readFile('log.csv', 'utf8', (error, data) => {
      if (error) {
        console.error('Error reading log file:', error);
        res.status(500).send('Error reading log file');
        return;
      }
  
      const rows = data.trim().split('\n').map((row) => {
        const columns = row.split(',');
        return {
          agent: columns[0],
          time: columns[1],
          method: columns[2],
          resource: columns[3],
          version: columns[4],
          status: columns[5],
        };
      });
  
      res.status(200).json(rows);
    });
  });

module.exports = app;
