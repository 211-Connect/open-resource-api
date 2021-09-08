import Router from '@koa/router';

import elasticsearch from '../../lib/elasticsearch';

const router = new Router({
  prefix: '/search',
});

/**
 * Build elasticsearch queries, filter out duplicates, and send back to client
 */
router.get('/', async (ctx) => {
  const { q, taxonomies, limit = 300, skip = 0, lat, lon, radius } = ctx.query;
  const min_score = 3;
  const queries = [];
  const index = 'results';

  if (taxonomies != null) {
    const splitTerms = (taxonomies as string).split(',') ?? [''];

    for (const term of splitTerms) {
      const body = {
        from: skip,
        size: limit,
        query: {
          bool: {
            must: {
              match_phrase_prefix: {
                taxonomy_code: {
                  query: term,
                },
              },
            },
          },
        },
      };

      // Apply geo shape filter when lat and lon are available
      if (lon && lat) {
        // @ts-ignore
        body.query.bool.filter = [
          {
            geo_shape: {
              service_area_shape: {
                shape: {
                  type: 'point',
                  coordinates: [
                    parseFloat(lon as string),
                    parseFloat(lat as string),
                  ],
                },
                relation: 'intersects',
              },
            },
          },
        ];

        // @ts-ignore
        body.sort = [
          {
            _geo_distance: {
              location: {
                lat: parseFloat(lat as string),
                lon: parseFloat(lon as string),
              },
              order: 'asc',
              unit: 'km',
              mode: 'min',
              distance_type: 'arc',
            },
          },
        ];

        if (radius && parseInt(radius as string) > 0) {
          // @ts-ignore
          body.query.bool.filter.push({
            geo_distance: {
              distance: radius + 'miles',
              location: {
                lat: parseFloat(lat as string),
                lon: parseFloat(lon as string),
              },
            },
          });
        }
      }

      queries.push({
        index: index,
      });
      queries.push(body);
    }
  } else {
    const body = {
      from: skip,
      size: limit,
      min_score,
      query: {
        bool: {
          must: {
            multi_match: {
              query: q,
              analyzer: 'standard',
              operator: 'AND',
              fields: [
                'organization_name',
                'service_name',
                'location_name',
                'service_description',
                'service_short_description',
                'taxonomy_term',
                'taxonomy_code',
              ],
            },
          },
        },
      },
    };

    // Apply geo shape filter when lat and lon are available
    if (lon && lat) {
      // @ts-ignore
      body.query.bool.filter = [
        {
          geo_shape: {
            service_area_shape: {
              shape: {
                type: 'point',
                coordinates: [
                  parseFloat(lon as string),
                  parseFloat(lat as string),
                ],
              },
              relation: 'intersects',
            },
          },
        },
      ];

      // @ts-ignore
      body.sort = [
        '_score',
        {
          _geo_distance: {
            location: {
              lat: parseFloat(lat as string),
              lon: parseFloat(lon as string),
            },
            order: 'asc',
            unit: 'km',
            mode: 'min',
            distance_type: 'arc',
          },
        },
      ];

      if (radius && parseInt(radius as string) > 0) {
        // @ts-ignore
        body.query.bool.filter.push({
          geo_distance: {
            distance: radius + 'miles',
            location: {
              lat: parseFloat(lat as string),
              lon: parseFloat(lon as string),
            },
          },
        });
      }
    }

    queries.push({
      index: index,
    });
    queries.push(body);
  }

  let geoResults;
  try {
    geoResults = await elasticsearch.msearch({ body: queries });
  } catch (err) {
    console.log(err);
  }
  const cache: KeyValue = {
    hits: [],
    existing: {},
  };

  // Filter out duplicate records, keep the same sorting
  for (const response of geoResults?.body?.responses ?? []) {
    for (const hit of response?.hits?.hits ?? []) {
      if (cache.existing[hit._id] != null) {
        continue;
      }

      cache.existing[hit._id] = hit;
      cache.hits.push(hit);
    }
  }

  ctx.body = cache?.hits ?? [];
});

export default router;
