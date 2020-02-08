module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb",
        "react-app"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-unused-expressions": [0],
        "react/jsx-curly-newline": [0],
        "react/state-in-constructor": [0],
        "react/static-property-placement": [0],
        "react/jsx-props-no-spreading": [0],
        "react/jsx-one-expression-per-line": [0],
        "react/prop-types": [0],
        "import/no-cycle": [0],
        "consistent-return": [0],
        "react/no-array-index-key": [0],
        "max-len": [0],
        "no-nested-ternary": [0],
    }
};