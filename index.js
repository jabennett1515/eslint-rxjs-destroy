module.exports = {
  plugins: [
    "eslint-plugin-rxjs-destroy", // or 'eslint-plugin-rxjs-subscribe-handling'
  ],
  rules: {
    "rxjs-destroy-handler": require("./lib/rules/rxjs-destroy-handler"),
  },
};
