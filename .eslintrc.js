module.exports = {
  "extends": "airbnb-base",
  "env": {
    "node" : true,
  },
  "rules": {
    "import/no-extraneous-dependencies": [0],
    "import/first": [0],
    "import/no-unresolved": [0],
    "import/extensions": [0],
    "import/prefer-default-export": [0],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "never",
      "functions": "ignore"
    }],
    "no-class-assign": "off",
  }
};
