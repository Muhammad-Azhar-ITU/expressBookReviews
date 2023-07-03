
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is authenticated
    if (!req.session.accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    // Verify the access token
    jwt.verify(req.session.accessToken, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid access token" });
      }
      req.user = decoded; // Store the decoded user information in the request object
      next(); // Continue to the next middleware/route handler
    });
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
