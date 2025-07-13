import { Type } from "@sinclair/typebox";

const authBodySchema = Type.Object({
  email: Type.String(),
  pwd: Type.String(),
});

const body = authBodySchema

const registerSchema = Type.Object({
  body,
  response: Type.Object({
    201: Type.Object({
      message: Type.String(),
      status: Type.Number(),
      success: Type.Boolean(),
    }),
  }),
});

const loginSchema = Type.Object({
  body,
  response: Type.Object({
    201: Type.Object({
      id: Type.Number(),
      email: Type.String(),
      Authorization: Type.String(),
    }),
  }),
});

const logoutSchema = Type.Object({
  response: Type.Object({
    205: Type.Object({
      message: Type.String(),
      status: Type.Number(),
      success: Type.Boolean(),
    }),
  }),
});

export {
    authBodySchema,
    registerSchema,
    loginSchema,
    logoutSchema,
}