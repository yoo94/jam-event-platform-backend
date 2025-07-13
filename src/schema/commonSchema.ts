import { Type } from "@sinclair/typebox";

const commonHeadersSchema = Type.Object({
    Authorization: Type.Optional(Type.String()), // 로그인되지 않은 경우도 있기 때문에 Optional로 설정
})

export { commonHeadersSchema };