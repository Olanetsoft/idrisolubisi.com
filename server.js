 // server.js

 require('dotenv').config();
 const express = require('express');
 const bodyParser = require('body-parser');
 const Pusher = require('pusher');

 const app = express();
 const port = process.env.PORT || 4000;
 const { v4 } = require('uuid');
 const pusher = new Pusher({
  
   appId: process.env.PUSHER_APP_ID,
   key: process.env.PUSHER_KEY,
   secret: process.env.PUSHER_SECRET,
   cluster: process.env.PUSHER_CLUSTER,
 });

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: false}));
 app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header(
     'Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept'
   );
   next();
 });

 app.listen(port, () => {
   console.log(`Server started on port ${port}`);
 });
 
 app.post('/Comment', (req, res) => {
    const {body} = req;
    const data = {
      ...body,
      timestamp: new Date(),
      id: v4(),
    };
    pusher.trigger('post-comment', 'new-comment', data);
    res.json(data);
  });
