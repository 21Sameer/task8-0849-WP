const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

// ReadFile Endpoint (GET /readFile)
app.get('/readFile/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, fileName);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    res.send(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// WriteFile Endpoint (POST /writeFile)
app.post('/writeFile/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, fileName);
  const data = req.body.data;

  if (!data) {
    return res.status(400).send('Data not provided in the request body');
  }

  try {
    await fs.writeFile(filePath, data, 'utf-8');
    res.send('File written successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// UpdateFile Endpoint (PUT /updateFile)
app.put('/updateFile/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, fileName);
  const newData = req.body.data;

  if (!newData) {
    return res.status(400).send('No new data provided in the request body');
  }

  try {
    // Append new data to the file on a new line
    await fs.appendFile(filePath, `\n${newData}`, 'utf-8');
    res.send('File updated successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
