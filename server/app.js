const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
    const agent = req.header('user-agent').replace(',', '');
    const time = new Date().toISOString();
    const method = req.method;
    const resource = req.originalUrl;
    const version = `HTTP/${req.httpVersion}`;
    const status = res.statusCode;

    console.log(`\n${agent},${time},${method},${resource},${version},${status}`);
    const logLine = (`\n${agent},${time},${method},${resource},${version},${status}`); 

    fs.appendFile('log.csv', logLine, () => {});

    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok').status(200);
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile('log.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading log file' });
          }
      
          // Split the data into rows and columns
          const rows = data.split('\n');
          const headers = rows[0].split(',');
          
          const logEntries = rows.slice(1).map(row => {
            const values = row.split(',');
            const logObject = {};

            headers.forEach((header, index) => {
              logObject[header] = values[index];
            });
            return logObject;
          });
      
          // Send the log entries as a JSON object
          res.json(logEntries);
        });
      });

module.exports = app;
