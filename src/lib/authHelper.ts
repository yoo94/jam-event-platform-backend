import bycrypt from 'bcrypt';
import db from './db';
import { ERROR_MESSAGE ,ROUND} from './constants';

const generateHash= async (pwd: string) =>{
    console.log('Generating hash for password:', pwd, 'with ROUND:', ROUND);
    const hashPwd = await bycrypt.hash(pwd, ROUND); //ROUND 숫자가 높으면 암호화의 정도가 올라가지만 성능이 떨어짐
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

export { generateHash, duplicateVerifyUser };
