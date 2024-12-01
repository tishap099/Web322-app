/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Tisha Patel Student ID: 140240235 Date: 30/11/2024
*   
********************************************************************************/

const express = require("express");
const path = require("path");
const countryService = require("./modules/country-service");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.set("view engine", "ejs");

// Home page (Featured Countries)
app.get("/", async (req, res) => {
  try {
    const countries = await countryService.getAllCountries();
    res.render("home", { countries });
  } catch (err) {
    res.status(500).render("500", { message: err });
  }
});

// Add Country page (GET)
app.get("/addCountry", async (req, res) => {
  try {
    const subRegions = await countryService.getAllSubRegions();
    res.render("addCountry", { subRegions });
  } catch (err) {
    res.status(500).render("500", { message: err });
  }
});

// Add Country (POST)
app.post("/addCountry", async (req, res) => {
  try {
    // Convert checkbox value to boolean
    req.body.landlocked = req.body.landlocked === "on";

    await countryService.addCountry(req.body);
    res.redirect("/");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// Edit Country page (GET)
app.get("/editCountry/:id", async (req, res) => {
  try {
    const [country, subRegions] = await Promise.all([
      countryService.getCountryById(req.params.id),
      countryService.getAllSubRegions(),
    ]);
    res.render("editCountry", { country, subRegions });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// Edit Country (POST)
app.post("/editCountry", async (req, res) => {
  try {
    // Convert checkbox value to boolean
    req.body.landlocked = req.body.landlocked === "on";

    await countryService.editCountry(req.body.id, req.body);
    res.redirect("/");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// Delete Country
app.get("/deleteCountry/:id", async (req, res) => {
  try {
    await countryService.deleteCountry(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// Country Details page
app.get("/country/:id", async (req, res) => {
  try {
    const country = await countryService.getCountryById(req.params.id);
    res.render("country", { country });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// 404 handler - This should be the second-last route
app.use((req, res) => {
  res.status(404).render("404");
});

// Initialize the service and start the server
countryService
  .initialize()
  .then(() => {
    const HTTP_PORT = process.env.PORT || 3000;
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize server: ${err}`);
  });