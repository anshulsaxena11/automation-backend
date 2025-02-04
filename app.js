const express = require("express")
require('dotenv').config();
const cors = require('cors')
const http = require("http");
const connectDB = require("./Config/dbConfig")
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT
connectDB();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

// .....routes...
app.use('/api/v1', require('./routes/indexRoutes'));
const server = http.createServer(app);
// server.listen(port, '192.168.0.211', () => {
//   console.log(`Server is running on http://0.0.0.0:${port}`);
// });
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});