module.exports = {
    "env": {
        "browser": true,
        "jest/globals": true,
    },
    "extends": "airbnb-base",
    "settings": {
      "import/resolver": "webpack"
    },
    "rules": {
        "indent": ["error", 4]
    },
    "plugins": ["jest"]
};
