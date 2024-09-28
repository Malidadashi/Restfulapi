const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('./routes/router', router);
// app.use('./',router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
