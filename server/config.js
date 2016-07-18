module.exports = function(environment) {
  var config = {
    "development": {
      "db": "mayday.db"
    },
    "test": {
      "db": "maydayTest.db"
    },
    "production": {
      "db": "mayday.db"
    }
  };

  return config[environment] || config.development;
};