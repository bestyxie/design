import {esClient} from './client';

esClient.index({
  index: 'prod',
  id: '1',
  type: 'product',
  body: {}
})