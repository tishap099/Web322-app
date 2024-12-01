require("pg"); // explicitly require the "pg" module
const { sequelize, Country, SubRegion } = require("./db");
const Sequelize = require("sequelize");

// Initialize function
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get all countries
function getAllCountries() {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [SubRegion],
      order: [["commonName", "ASC"]],
    })
      .then((countries) => {
        resolve(countries);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get country by ID
function getCountryById(id) {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [SubRegion],
      where: {
        id: id,
      },
    })
      .then((countries) => {
        if (countries.length > 0) {
          resolve(countries[0]);
        } else {
          reject("Unable to find requested country");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get countries by subregion
function getCountriesBySubRegion(subRegion) {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [SubRegion],
      where: {
        "$SubRegion.subRegion$": {
          [Sequelize.Op.iLike]: `%${subRegion}%`,
        },
      },
    })
      .then((countries) => {
        if (countries.length > 0) {
          resolve(countries);
        } else {
          reject("Unable to find requested countries");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get countries by region
function getCountriesByRegion(region) {
  return new Promise((resolve, reject) => {
    Country.findAll({
      include: [SubRegion],
      where: {
        "$SubRegion.region$": region,
      },
    })
      .then((countries) => {
        if (countries.length > 0) {
          resolve(countries);
        } else {
          reject("Unable to find requested countries");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get all subregions
function getAllSubRegions() {
  return new Promise((resolve, reject) => {
    SubRegion.findAll()
      .then((subRegions) => {
        resolve(subRegions);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Add new country
function addCountry(countryData) {
  return new Promise((resolve, reject) => {
    Country.create(countryData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// Edit existing country
function editCountry(id, countryData) {
  return new Promise((resolve, reject) => {
    Country.update(countryData, {
      where: { id: id },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// Delete country
function deleteCountry(id) {
  return new Promise((resolve, reject) => {
    Country.destroy({
      where: { id: id },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

module.exports = {
  initialize,
  getAllCountries,
  getCountryById,
  getCountriesBySubRegion,
  getCountriesByRegion,
  getAllSubRegions,
  addCountry,
  editCountry,
  deleteCountry,
};
