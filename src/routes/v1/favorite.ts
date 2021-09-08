import Router from '@koa/router';
import { v4 as uuid } from 'uuid';
import authorize from '../../middleware/authorize';

import prisma from '../../lib/prisma';

const router = new Router({
  prefix: '/favorite',
});

/**
 * Get all favorites for a specified user (based on current user being authorized)
 */
router.get('/', authorize(), async (ctx) => {
  const userId = ctx.state.user.sub;

  const favorites = await prisma.favorite.findMany({
    where: {
      user_id: userId,
    },
    include: {
      service: {
        include: {
          phone: {
            take: 1,
          },
          organization: true,
        },
      },
      service_at_location: {
        include: {
          phone: {
            take: 1,
          },
          service: {
            include: {
              organization: true,
            },
          },
          location: {
            include: {
              physical_address: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  ctx.body = favorites;
});

/**
 * Get a favorite by ID. The service at location table supports both {service}-{location}
 * and {service} as valid formats for an ID. Depending on the format, the query needs to be slightly different.
 */
router.get('/:id', authorize(), async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.sub;

  if (!id || id.length === 0) throw new Error('Invalid ID provided');

  let favorite;
  if (id.includes('-')) {
    favorite = await prisma.favorite.findFirst({
      where: {
        user_id: userId,
        service_at_location_id: id as string,
      },
    });
  } else {
    favorite = await prisma.favorite.findFirst({
      where: {
        user_id: userId,
        service_id: id as string,
      },
    });
  }

  ctx.body = favorite;
});

/**
 * Create a new favorite based on the currently authorized user.
 */
router.post('/', authorize(), async (ctx) => {
  // @ts-ignore
  const { id } = ctx.request.body;
  const userId = ctx.state.user.sub;

  if (!id || id.length === 0) throw new Error('Invalid ID provided');

  let favorite;
  if (id.includes('-')) {
    favorite = await prisma.favorite.create({
      data: {
        id: uuid(),
        user_id: userId,
        service_at_location_id: id as string,
      },
    });
  } else {
    favorite = await prisma.favorite.create({
      data: {
        id: uuid(),
        user_id: userId,
        service_id: id as string,
      },
    });
  }

  ctx.body = favorite;
});

/**
 * Delete a favorite based on the currently authorized user.
 */
router.delete('/:id', authorize(), async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.sub;

  if (!id || id.length === 0) throw new Error('Invalid ID provided');

  let favorite;
  if (id.includes('-')) {
    favorite = await prisma.favorite.deleteMany({
      where: {
        service_at_location_id: id as string,
        user_id: userId,
      },
    });
  } else {
    favorite = await prisma.favorite.deleteMany({
      where: {
        service_id: id as string,
        user_id: userId,
      },
    });
  }

  ctx.body = favorite;
});

export default router;
