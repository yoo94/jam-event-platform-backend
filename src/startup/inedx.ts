// 서버가 시작할때 미리 할것
import db from "../lib/db";
import { generateHash } from "../lib/authHelper";
import { FIRST_PWD } from "../lib/constants";

const checkStartupUser = async () => {
    const pwd = FIRST_PWD as string;
    const hashPwd = await generateHash(pwd);
    const userCount = await db.user.count({});
    if (userCount === 0) {
        let count = 1;
        let maxCount = 1;
        while (count <= maxCount) {
            const value = {
                email: `user${count}@example.com`,
                password: hashPwd
            }
            await db.user.create({
                data: value
            });
            count++;
        }
        console.log("Startup user created successfully");
    }
}

const checkStartupArticle = async () => {
    const articleCount = await db.article.count({});
    if (articleCount === 0) {
        const user = await db.user.findFirst({
            orderBy: {
                id: 'asc'
            }
        });
        if(user){
        let count = 1;
        let maxCount = 50;
        while (count <= maxCount) {
            const values = {
                content: `Content for article ${count}`,
                userId: user.id
            }
            await db.article.create({
                data: values
            });
            count++;
        }
        console.log("Startup articles created successfully");
    }else{
        await checkStartupUser();
        await checkStartupArticle();
    }
    }
    
}

export {
    checkStartupUser,
    checkStartupArticle
}