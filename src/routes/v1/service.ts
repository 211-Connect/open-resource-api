import Router from '@koa/router';

import prisma from '../../lib/prisma';

const router = new Router({
  prefix: '/service',
});

router.get('/:id', async (ctx) => {
  const service = await prisma.service.findFirst({
    where: {
      id: ctx.params.id,
    },
    include: {
      contact: true,
      eligibility: true,
      payment_accepted: true,
      funding: true,
      schedule: true,
      service_area: true,
      service_attribute: true,
      service_at_location: true,
      language: true,
      required_document: true,
      phone: true,
      program: true,
    },
  });

  ctx.body = service;
});

export default router;
