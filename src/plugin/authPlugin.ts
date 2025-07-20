import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { verifyAccessToken, shortVerifyRefreshToken } from '../lib/authHelper';
import fp from 'fastify-plugin';
import { TCommonHeaders } from '../schema/types';

declare module 'fastify' {
    interface FastifyRequest {
      user: {
        id: number;
        email: string;
      } | null;
    }
}

const currentlyAuth: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null);

  fastify.addHook('preHandler', async (request: FastifyRequest<{Headers: TCommonHeaders}>) => {
    const {authorization} = request.headers;
    const refreshToken = request.cookies.refresh_token;

    if (!authorization && !refreshToken) {
      return; // No authentication headers or cookies, skip further checks
    }

    try {
      // refreshToken이 존재할 때만 검증
      if (refreshToken) {
        shortVerifyRefreshToken(refreshToken);
      }

      // authorization이 존재할 때만 검증
      if (authorization) {
        const decoded = verifyAccessToken(authorization);
        request.user = {
          id: decoded.id,
          email: decoded.email,
        };
      }
    } catch (error) {
      return;
    }
  });
}

export const currentlyAuthPlugin = fp(currentlyAuth, {
  name: 'currentlyAuthPlugin'
});

