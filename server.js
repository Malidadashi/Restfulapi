const express = require('express');
const bodyParser = require('body-parser'); // manipulate body request before header
const cors = require('cors'); // access this API from a different domain
const router = require('./routes/router.js');


const app = express();
const PORT = 6000;
const corsuse={
  //definition http methods,original url &...
}
app.get('/', (req, res) => {
  res.send("GET Request Called")
})

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

// Enable CORS middleware
// app.use(cors(corsuse));

// // Parse JSON request bodies middleware
// app.use(bodyParser.json());

// // Use the router for handling routes
// app.use('./data/article.json', router);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something is broken');
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});