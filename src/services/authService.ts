import db from "../lib/db";
import { generateHash, duplicateVerifyUser, verifyPassword, generateAccessToken, generateRefreshToken } from "../lib/authHelper";
import { ERROR_MESSAGE } from "../lib/constants";

function authService(){
    const register = async (email: string, pwd: string) => {
        try {
            // 이메일 중복 확인
            await duplicateVerifyUser(email);
            // 비밀번호 해시화
            const hashedPassword = await generateHash(pwd);
            // 사용자 생성
            const returnValue = await db.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                }
            });
            console.log("User created successfully:", returnValue);

            return returnValue;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    };

    const loginWithPassword = async (email: string, pwd: string) => {
        try {
          const authenticationUser = await db.user.findUnique({
            where: {
              email: email,
            },
            select: {
              id: true,
              email: true,
            },
          }) 
          if(!authenticationUser) throw ERROR_MESSAGE.badRequest
          const passwordVerification = await verifyPassword(email, pwd)
          if(!passwordVerification) throw ERROR_MESSAGE.unauthorized
          const accessToken =  generateAccessToken(authenticationUser)
          const refreshToken = generateRefreshToken(authenticationUser)
          const values ={
            userId: authenticationUser.id,
            refreshToken: refreshToken,
          }
          await db.token.create({
            data: values,
          })
          const returnValue = {
            id: authenticationUser.id,
            email: authenticationUser.email,
            accessToken: accessToken,
            refreshToken: refreshToken
          }
          return returnValue
        }
        catch(error) {
          throw error
        }
  }
  const logout = async (refreshToken: string) => {
    try {
      const returnValue = await db.token.deleteMany({
        where: {
          refreshToken: refreshToken
        }
      })
      return returnValue
    } catch (error) {
      throw error
    }
  }
  return { register, loginWithPassword , logout };
}

export default authService;