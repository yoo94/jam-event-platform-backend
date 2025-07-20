import bcrypt from 'bcrypt';
import db from './db';
import { ACCESS_TOKEN_EXPIRES, ERROR_MESSAGE ,REFRESH_TOKEN_EXPIRES,ROUND, SECRET_KEY} from './constants';
import jwt , {JwtPayload} from 'jsonwebtoken'
import { handleError } from './errorHelper';
import { FastifyReply, FastifyRequest } from 'fastify'

const generateHash= async (pwd: string) =>{
    console.log('Generating hash for password:', pwd, 'with ROUND:', ROUND);
    const hashPwd = await bcrypt.hash(pwd, ROUND); //ROUND 숫자가 높으면 암호화의 정도가 올라가지만 성능이 떨어짐
    return hashPwd;
}

const duplicateVerifyUser = async (email: string) => {
    try {
        const userCount = await db.user.count({
            where: {
                email: email,
            }
        });
        console.log('User count:', userCount);
        if (userCount > 0) {
            throw new Error(ERROR_MESSAGE.alreadySignedUp.message);
        }
        return true;
    } catch (error) {
        throw error;
    }
}

const verifyPassword = async (email: string, pwd: string) => {
    try {
        const encryptedPwd = await db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                password: true, // 비밀번호 필드만 선택
            }
        });
        if (!encryptedPwd) {
            return false; // 사용자 없음
        }
        return bcrypt.compareSync(pwd, encryptedPwd.password);
        
    } catch (error) {
        throw error;
    }
}

const generateAccessToken = (user: { id: number, email: string }) => {
  const accessToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES} )
  return accessToken
}

const generateRefreshToken = (user: { id: number, email: string }) => {
  const refreshToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRES})
  return refreshToken
}

// 유효한 refresh_token인지 확인
const verifyRefreshToken = async( refresh_token: string) => {
  try {
    const decoded = jwt.verify(refresh_token, SECRET_KEY) as JwtPayload;
    const tokenFromServer = await db.token.count({
      where: {
        userId: decoded.id,
        refreshToken: refresh_token,
      }
    });
    if(tokenFromServer > 0) {
      return decoded;
    }else{
        throw ERROR_MESSAGE.unauthorized;
    }
  } catch (error) {
    throw ERROR_MESSAGE.unauthorized;
  }
}

// 토큰 상태만 체크
const shortVerifyRefreshToken = async (refresh_token: string) => {
  const decoded = jwt.verify(refresh_token, SECRET_KEY) as JwtPayload;
  if (!decoded) {
    return false;
  }
  else {
    return true;
  }
}

// 액세스 토큰 유효성 검사
const verifyAccessToken = (access_token: string) => {
  try {
    const decoded = jwt.verify(access_token, SECRET_KEY) as JwtPayload;
    return decoded;
  } catch (error) {
    throw ERROR_MESSAGE.invalidToken;
  }
}


const verifySignIn = async (req: FastifyRequest, rep: FastifyReply) => {
  const userId = req.user?.id
  const email = req.user?.email

  if(userId && email) {
    return // 토큰에도 이상이 없으면 true 리턴
  }
  else {
    handleError(rep, ERROR_MESSAGE.unauthorized)
  }
}

export {
   generateHash,
   duplicateVerifyUser,
   verifyPassword,
   generateAccessToken,
   generateRefreshToken,
   verifyRefreshToken,
   shortVerifyRefreshToken,
   verifyAccessToken,
   verifySignIn
};
