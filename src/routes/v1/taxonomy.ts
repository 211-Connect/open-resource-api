import Router from '@koa/router';

import elasticsearch from '../../lib/elasticsearch';

const router = new Router({
  prefix: '/taxonomy',
});

router.get('/', async (ctx) => {
  const { q } = ctx.query;

  if (!q || q.length === 0) throw new Error('Invalid query');

  const taxonomies = await elasticsearch.search({
    index: 'taxonomies',
    body: {
      query: {
        multi_match: {
          query: q,
          type: 'bool_prefix',
          fields: ['term', 'term._2gram', 'term._3gram'],
        },
      },
    },
  });

  ctx.body = taxonomies;
});

export default router;
