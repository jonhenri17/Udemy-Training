import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
// Downloads an image from a public URL, filters it,
// returns the filtered image, then deletes the temporary file.
app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;

  if (!image_url) {
    return res.status(422).send("image_url is required");
  }

  try {
    const filteredImage = await filterImageFromURL(image_url);

    res.status(200).sendFile(filteredImage, () => {
      deleteLocalFiles([filteredImage]);
    });
  } catch (error) {
    console.error("Unable to process image:", error);
    res.status(422).send("Unable to process image");
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('try GET /filteredimage?image_url={{URL}}');
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});