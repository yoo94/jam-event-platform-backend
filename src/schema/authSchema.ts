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

export {
    authBodySchema,
    registerSchema,
}