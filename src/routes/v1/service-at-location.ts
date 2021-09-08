import Router from '@koa/router';

import prisma from '../../lib/prisma';

const router = new Router({
  prefix: '/service-at-location',
});

router.get('/:id', async (ctx) => {
  const serviceAtLocation = await prisma.service_at_location.findFirst({
    where: { id: ctx.params.id },
    include: {
      service: {
        include: {
          organization: true,
          eligibility: true,
          schedule: true,
        },
      },
      phone: {
        take: 1,
      },
      location: {
        include: {
          physical_address: {
            take: 1,
          },
          language: true,
        },
      },
    },
  });

  ctx.body = serviceAtLocation;
});

export default router;
