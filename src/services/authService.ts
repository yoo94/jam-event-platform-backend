import db from "../lib/db";
import { generateHash, duplicateVerifyUser } from "../lib/authHelper";

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

    return { register };
}

export default authService;