module.exports = {
  plugins: [
    "eslint-rxjs-destroy-validator", // or 'eslint-plugin-rxjs-subscribe-handling'
  ],
  rules: {
    "rxjs-destroy-handler": require("./lib/rules/rxjs-destroy-handler"),
  },
};
