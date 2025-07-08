import { Secret } from "jsonwebtoken";

export const FIRST_PWD = process.env.FIRST_PWD
export const SECRET_KEY = process.env.SECRET_KEY as Secret;
export const ROUND = Number(process.env.HASH_ROUNDS);
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

const ERROR_MESSAGE = {
    badRequest:{
        success: false,
        status: 400,
        message: "Bad Request",
    },
    likeAddError: {
        success: false,
        status: 400,
        message: "Like already exists",
    },
    likeCancelError: {
        success: false,
        status: 400,
        message: "Like does not exist",
    },
    notFound: {
        success: false,
        status: 404,
        message: "Not Found",
    },
    internalServerError: {
        success: false,
        status: 500,
        message: "Internal Server Error",
    },
    unauthorized: {
        success: false,
        status: 401,
        message: "Unauthorized",
    },
    invalidToken: {
        success: false,
        status: 401,
        message: "Invalid Token",
    },
    notExpired:{
        success: false,
        status: 401,
        message: "Token not expired",
    },
    forbidden: {
        success: false,
        status: 403,
        message: "Forbidden",
    },
    alreadySignedUp: {
        success: false,
        status: 400,
        message: "Already signed up",
    },
    preconditionFailed: {
        success: false,
        status: 412,
        message: "Precondition Failed",
    },
    conflict: {
        success: false,
        status: 409,
        message: "Conflict",
    },
    serverError: {
        success: false,
        status: 500,
        message: "Server Error",
    },
} as const;

const SUCCESS_MESSAGE = {
    loginOk: {
        success: true,
        status: 201,
        message: "Login successful",
    },
    logoutOk:{
        success: true,
        status: 205,
        message: "Logout successful",
    },
    refreshToken:{
        success: true,
        status: 201,
        message: "Refresh token successful",
    },
    accessToken: {
        success: true,
        status: 200,
        message: "Access token successful",
    },

    registerOk: {
        success: true,
        status: 201,
        message: "Registration successful",
    },
}as const;




export  {ERROR_MESSAGE, SUCCESS_MESSAGE};
