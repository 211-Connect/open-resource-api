import { Client as elasticClient } from '@elastic/elasticsearch';

const elasticsearch = new elasticClient({
  node: process.env.ELASTIC_URL,
  auth: {
    apiKey: {
      id: process.env.ELASTIC_API_KEY_ID as string,
      api_key: process.env.ELASTIC_API_KEY as string,
    },
  },
});

export default elasticsearch;
