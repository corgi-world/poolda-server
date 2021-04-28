const {
  Translate
} = require("@google-cloud/translate");

const translate = new Translate();

const target = "en";

async function call_api(text) {
  let [translations] = await translate.translate(
    text,
    target
  );
  translations = Array.isArray(translations)
    ? translations
    : [translations];

  return translations[0];
}

module.exports = call_api;
