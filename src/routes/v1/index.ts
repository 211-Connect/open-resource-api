import Router from '@koa/router';

import serviceAtlocation from './service-at-location';
import place from './place';
import favorite from './favorite';
import taxonomy from './taxonomy';
import search from './search';
import service from './service';
import organization from './organization';

const router = new Router({
  prefix: '/api/v1',
});

router.use(serviceAtlocation.routes()).use(serviceAtlocation.allowedMethods());
router.use(place.routes()).use(place.allowedMethods());
router.use(favorite.routes()).use(favorite.allowedMethods());
router.use(taxonomy.routes()).use(taxonomy.allowedMethods());
router.use(search.routes()).use(search.allowedMethods());
router.use(service.routes()).use(service.allowedMethods());
router.use(organization.routes()).use(organization.allowedMethods());

export default router;
