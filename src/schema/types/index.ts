import { Static } from "@sinclair/typebox";
import { authBodySchema } from "../authSchema";
import { commonHeadersSchema } from "../commonSchema";

type TAuthBody = Static<typeof authBodySchema>;
type TCommonHeaders = Static<typeof commonHeadersSchema>;

export {
    TAuthBody,
    TCommonHeaders,
}