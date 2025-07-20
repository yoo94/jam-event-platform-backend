import db from "./db";

// articleId로 검색된 유저와 로그인 정보로 받은 유저 아이디를 비교해 같으면 true
const verifyArticleUser = async (articleId: number, userId: number) => {
    try {
        const article = await db.article.findUnique({ where: { id: articleId }, select: { userId: true } })
        if (!article) return false
        return article.userId === userId
    } catch (error) {
        throw new Error("Error verifying article user: " + error.message)
    }
}

export { verifyArticleUser };