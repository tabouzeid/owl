// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const passport = require('passport');
const path = require('path');
const session = require('express-session');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Requiring our models for syncing
const db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("client/build"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
// =============================================================
require("./routes/api-passport-routes.js")(app);
require("./routes/api-routes.js")(app);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Running on http://localhost:" + PORT);
    });
});
