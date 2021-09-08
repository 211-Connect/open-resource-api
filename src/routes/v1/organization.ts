import Router from '@koa/router';

import prisma from '../../lib/prisma';

const router = new Router({
  prefix: '/organization',
});

router.get('/:id', async (ctx) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: ctx.params.id,
    },
    include: {
      contact: true,
      funding: true,
      location: true,
      phone: true,
      program: true,
      service: true,
    },
  });

  ctx.body = organization;
});

export default router;
