module.exports = {
    /*  Refresher_Notes:

        You may wonder, why we need to also install eslint-config-prettier. You can find the answer in the
        following link: https://blog.logrocket.com/using-prettier-eslint-automate-formatting-fixing-javascript/.
        The article also explains lots of useful and advanced usages of prettier and eslint, in an understandable 
        way.
    */

    /*  As suggested by https://github.com/prettier/eslint-config-prettier#installation you should make sure "prettier"
        goes LAST in "extends", so that it gets the chance to override other configs.
    */
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    plugins: ["prettier", "import", "@typescript-eslint"],
    rules: {
        semi: "warn",
        "comma-dangle": "warn",
        "no-constant-binary-expression": "error",
        "no-unused-vars": "warn",
        "no-param-reassign": "error"
    },
    env: {
        browser: true,
        es6: true,
        node: true,
        serviceworker: true
    },
    overrides: [
        {
            env: {
                node: true
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script"
            }
        }
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "2020",
        sourceType: "module"
    }
};
