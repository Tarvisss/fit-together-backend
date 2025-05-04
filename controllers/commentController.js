const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const { NotFoundError } = require("../middleware/errorHandling");
// Create new comment for a challenge
exports.createComment = async (req, res, next) => {
    try {
        const {user_id, content} = req.body;  
        const challengeId = Number(req.params.challengeId);
        const newComment = await prisma.comments.create({
            data: {
              user_id,
              content,
              challenge_id: challengeId},
        });
        res.status(200).json(newComment);
      } catch (err) {
        next(err);
      }
}

//gets all comments for a challenge
exports.getComments = async (req, res, next) => {
    try {
        const challengeId = Number(req.params.challengeId);
        const challengeComments = await prisma.comments.findMany({
            take: 10,
            where: {challenge_id: challengeId},
            orderBy: {created_at: "desc"}
        });
        if(challengeComments.length === 0){
            res.status(200).json({ message: "No comments yet"})
        }
        res.status(200).json(challengeComments);
      } catch (err) {
        next(err);
      }
}

// get a single comment by id
exports.getComment = async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const comment = await prisma.comments.findUnique({
            where: {id: id}
        })
        if(!comment){
            res.status(404).json({error: "comment not found"})
        }

        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

//edit a single comment
exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
    
        if (!content) {
          return res.status(400).json({ error: "Content is required to update comment" });
        }
    
        const updatedComment = await prisma.comments.update({
          where: { id: Number(id) },
          data: { content },
          select: {
            id: true,
            content: true,
            created_at: true,
            user_id: true,
            challenge_id: true,
          },
        });
    
        res.json(updatedComment);
      } catch (error) {
        console.error(error);
        next(error);  // pass to your generic error handler
      }
}

//delete a comment
exports.removeComment = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.comments.delete({
          where: { id: id },
        });
        res.status(200).json({ message: "comment deleted!" });
      } catch (error) {
        if (error.code === "P2025") {
          return next(new NotFoundError("Comment not found"));
        }
        next(error);
      }
}
