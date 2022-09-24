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
        "max-len": [1, { "code": 120, ignoreComments: true }], // Keep this, but maybe enforce max-len for comments?

        // BEGIN TEST OVERRIDES - THIS SHOULD BE EMPTY BEFORE DECIDING
        "react/self-closing-comp": 0,
        "react/jsx-props-no-spreading": 0,
        "@typescript-eslint/no-use-before-define": 0,
        // END TEST OVERRIDES

        // Rules below this point are real overrides. Rules above this are likely temporary overrides
        "quotes": [2, "single", { "avoidEscape": true }], // Use single quotes
        "jsx-quotes": [2, "prefer-single"], // Use single quotes for jsx
        "react/function-component-definition": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "no-multiple-empty-lines": [2, { "max": 2 }], // Error, but let people have 2
        "react/jsx-one-expression-per-line": 0, // This rule sucks
        "object-curly-spacing": [1, "always"],
        "react/jsx-curly-spacing": [2, {
            "when": "always",
            children: true,
        }],
        "array-bracket-spacing": [2, "always"],
        "arrow-parens": [2, "as-needed"],
        "no-console": [1, { "allow": ["warn", "error"] }],
        // toDO: This ain't working like I want
        //"object-property-newline": [2, { "allowAllPropertiesOnSameLine": true }],
        "object-curly-newline": [2, { minProperties: 5, multiline: true, consistent: true}],
        "no-plusplus": "off",

        // Turning these both off because we're using TS and they're in the way
        "react/prop-types": 0,
        "react/require-default-props": 0,
        "operator-linebreak": [2, "after"],
    },
};
