import { Static } from '@sinclair/typebox'
import { authBodySchema } from '../authSchema'
import { commonHeadersSchema, articleSchema, commonBodySchema, commonParamSchema, commonQuerySchema, commonPagenationSchema } from '../commonSchema'

type TAuthBody = Static<typeof authBodySchema>
type TCommonHeaders = Static<typeof commonHeadersSchema>
type TArticle = Static<typeof articleSchema>
type TCommonBody = Static<typeof commonBodySchema>
type TCommonParam = Static<typeof commonParamSchema>
type TCommonQuery = Static<typeof commonQuerySchema>
type TCommonPagenation = Static<typeof commonPagenationSchema>

export {
	TAuthBody,
	TCommonHeaders,
	TArticle,
	TCommonBody,
	TCommonParam,
	TCommonQuery,
	TCommonPagenation,
}