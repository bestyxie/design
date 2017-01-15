import elasticsearch from 'elasticsearch';

export const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200'
});