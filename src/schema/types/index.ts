import { Static } from "@sinclair/typebox";
import { authBodySchema } from "../authSchema";

type TAuthBody = Static<typeof authBodySchema>;

export {
    TAuthBody,
}