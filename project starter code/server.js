import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import axios from "axios";



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async(req, res) => {
    
    try{
    const image_url = req.query.image_url.toString();

    //validate the image_url query
    if(!image_url){
      res.status(400).send("Error - Please provide an image url");
    }else {

      // call axios to get the image and convert it to a buffer
      const imageBuffer = await axios({
        method: "get",
        url: image_url,
        responseType: "arraybuffer",
      }).then((response) => Buffer.from(response.data, "binary"));

      // call filterImageFromURL(image_url) to filter the image
      const filteredImage = await filterImageFromURL(imageBuffer);

      //send the resulting file in the response
      res.status(200).sendFile(filteredImage);

       res.on('finish', function() {
        //delete any files on the server on finish of the response
            deleteLocalFiles[filteredImage]
        });
      
    }
  }catch{
    res.status(500).send("An unexpected error happened. ");
  }

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
