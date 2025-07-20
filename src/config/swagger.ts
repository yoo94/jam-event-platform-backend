export const swaggerOptions = {
  swagger: {
    info: {
      title: 'JAM Event Platform API',
      description: 'JAM 이벤트 플랫폼 백엔드 API 문서',
      version: '1.0.0',
    },
    host: 'localhost:8083',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'auth', description: '인증 관련 API' },
      { name: 'articles', description: '게시글 관련 API' },
      { name: 'users', description: '사용자 관련 API' },
      { name: 'like', description: '좋아요 관련 API' },
      { name: 'comments', description: '댓글 관련 API' },
    ],
  },
};

export const swaggerUIOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full' as const,
    deepLinking: false,
  },
  staticCSP: true,
};
