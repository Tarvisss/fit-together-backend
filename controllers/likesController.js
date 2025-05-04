const { PrismaClient } = require('../generated/prisma'); // or wherever your generated client is
const prisma = new PrismaClient();

exports.addLikeToComment = async (req, res, next) => {

    try {
        const commentId = Number(req.params.commentId);
        const { userId } = req.body;

        if (!commentId || !userId) {
            return res.status(400).json({ error: "Missing commentId or userId" });
        }
        // Create the like, using the correct challenge_id
        const newLike = await prisma.likes.create({
            data: {
                user_id: userId,
                comment_id: commentId,
            }
        });

        res.status(201).json(newLike);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// remove a like
exports.removeLike = async (req, res, next) => {
    const commentId = Number(req.params.commentId); 
    const { userId } = req.body;

    try {
        const removedLike = await prisma.likes.delete({
            where: {
                user_id_comment_id: {
                    user_id: userId,
                    comment_id: commentId,
                },
            },
        });

        res.status(201).json(removedLike);
    } catch (error) {
        console.error(error);
        next(error);  
    }
};
