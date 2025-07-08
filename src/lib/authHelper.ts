import bcrypt from 'bcrypt';
import db from './db';
import { ACCESS_TOKEN_EXPIRES, ERROR_MESSAGE ,REFRESH_TOKEN_EXPIRES,ROUND, SECRET_KEY} from './constants';
import jwt from 'jsonwebtoken'

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

export { generateHash, duplicateVerifyUser, verifyPassword, generateAccessToken, generateRefreshToken };
