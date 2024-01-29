const express = require('express');
const fs = require('fs');
const app = express();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const {parse} = require('csv-parse');

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
console.log('line 34',logEntry);
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
console.log('Root route assessed')
res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    fs.readFile('log.csv', 'utf8', (error, data) => {
        if (error) {
            console.error('Error reading log file:', error);
            res.status(500).send('Error reading log file');
            return;
        }

        parse(data, {
            columns: true,
            skip_empty_lines: true,
        }, (parseError, records) =>  {
            if (parseError) {
                console.error('Error parsing CSV:', parseError);
                res.status(500).send('Error processing request');
            return;
        }
        res.status(200).json(records);
    });
    });
});
module.exports = app;

// app.get('/logs', (req, res) => {
//     fs.readFile('log.csv', 'utf8', (error, data) => {
//       if (error) {
//         console.error('Error reading log file:', error);
//         res.status(500).send('Error reading log file');
//         return;
//       }
  
//       const rows = data.trim().split('\n').slice(1).map((row) => {
//         const columns = row.split(',');
//         return {
//           Agent: columns[0],
//           Time: columns[1],
//           Method: columns[2],
//           Resource: columns[3],
//           Version: columns[4],
//           Status: columns[5],
//         };
//       });
  
//       res.status(200).json(rows);
//     });
//   });
