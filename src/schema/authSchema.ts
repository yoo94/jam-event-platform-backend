import { Type } from "@sinclair/typebox";

const authBodySchema = Type.Object({
  email: Type.String(),
  pwd: Type.String(),
});

// Fastify에서 Swagger에 body 파라미터가 제대로 노출되려면 아래처럼 객체 최상위에 body, response를 분리해서 작성해야 합니다.

const registerSchema = {
  body: authBodySchema,
  response: {
    201: Type.Object({
      message: Type.String(),
      status: Type.Number(),
      success: Type.Boolean(),
    }),
  },
};

const loginSchema = {
  body: authBodySchema,
  response: {
    201: Type.Object({
      id: Type.Number(),
      email: Type.String(),
      Authorization: Type.String(),
    }),
  },
};

const logoutSchema = {
  response: {
    205: Type.Object({
      message: Type.String(),
      status: Type.Number(),
      success: Type.Boolean(),
    }),
  },
};

const refreshTokenSchema = {
  response: {
    201: Type.Object({
      id: Type.Number(),
      email: Type.String(),
      Authorization: Type.String(),
    }),
  },
};

export {
  authBodySchema,
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
}