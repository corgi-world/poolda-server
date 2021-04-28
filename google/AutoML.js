const automl = require(`@google-cloud/automl`);

const client = new automl.v1beta1.PredictionServiceClient();

const projectId = "king-bingbong";
const computeRegion = "us-central1";
const modelId = "TCN1905260388540484792";

const modelFullId = client.modelPath(
  projectId,
  computeRegion,
  modelId
);

async function call_api(text) {
  const payload = {
    textSnippet: {
      content: text,
      mimeType: `text/plain`
    }
  };

  const [response] = await client.predict({
    name: modelFullId,
    payload: payload,
    params: {}
  });

  return response.payload;
}

module.exports = call_api;
