module.exports = {
    extends: [
        "airbnb",
        "airbnb/hooks",
        "airbnb-typescript"
    ],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        "react/function-component-definition": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "no-multiple-empty-lines": [2, { "max": 2 }], // Error, but let people have 2
        "max-len": [1, { "code": 120 }],
        "react/jsx-one-expression-per-line": 0, // This rule sucks
        "object-curly-spacing": [1, "always"],
        "react/jsx-curly-spacing": [2, {
            "when": "always",
            children: true,
        }],
        "array-bracket-spacing": [2, "always"],
        "arrow-parens": [2, "as-needed"],
        "no-console": [1, { "allow": ["warn", "error"] }],
        //"object-property-newline": [2, { "allowAllPropertiesOnSameLine": true }],
        "object-curly-newline": [2, { minProperties: 5, multiline: true, consistent: true}],
        "no-plusplus": "off",
    },
};
