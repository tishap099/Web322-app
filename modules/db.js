require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// Define SubRegion model
const SubRegion = sequelize.define('SubRegion', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subRegion: Sequelize.STRING,
    region: Sequelize.STRING
}, {
    timestamps: false
});

// Define Country model
const Country = sequelize.define('Country', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    commonName: Sequelize.STRING,
    officialName: Sequelize.STRING,
    nativeName: Sequelize.STRING,
    currencies: Sequelize.STRING,
    capital: Sequelize.STRING,
    languages: Sequelize.STRING,
    openStreetMaps: Sequelize.STRING,
    population: Sequelize.INTEGER,
    area: Sequelize.INTEGER,
    landlocked: Sequelize.BOOLEAN,
    coatOfArms: Sequelize.STRING,
    flag: Sequelize.STRING,
    subRegionId: Sequelize.INTEGER
}, {
    timestamps: false
});

// Define association
Country.belongsTo(SubRegion, {foreignKey: 'subRegionId'});

module.exports = {
    sequelize,
    Country,
    SubRegion
};