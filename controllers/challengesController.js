const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient();

//get a list if challenges
exports.getChallenges = async (req, res, next) => {
    try {
        const challenges = await prisma.challenges.findMany();
        return res.json(challenges);
    } catch (error) {
        next(error);
    }
    
}
//get a single challenge
exports.getChallenge = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "Invalid ID format"})
        }
        const challenge = await prisma.challenges.findUnique({
            where: { id },
        });

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        return res.json(challenge); 
    } catch (error) {
        next(error); 
    }
}

//create a new challenge
exports.createChallenge = async (req, res, next) => {
  try {
      const {title, description, start_date, end_date, created_at} = req.body;
      
      // Ensure that dates are valid and convert to ISO format
      const formattedStartDate = new Date(start_date).toISOString();
      const formattedEndDate = new Date(end_date).toISOString(); 
      const formattedCreatedAt = new Date(created_at).toISOString();

      
      const creator_id = req.user.userId;
    
      const newChallenge = await prisma.challenges.create({
          data: {
              title,
              description,
              start_date: formattedStartDate,
              end_date: formattedEndDate,
              created_at: formattedCreatedAt,
              creator_id
          },
      });

      return res.status(201).json(newChallenge);
  } catch (error) {
      console.error("Error during challenge creation:", error);
      next(error);
  }
}

// Route not emplemented on the frontend yet.
//udate challenge details
exports.updateChallenge = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
    
        if(isNaN(id)){
            return res.status(400).json({ error: "Invalid ID format"})
        }

        const loggedInUserId = req.user?.userId

        const challenge = await prisma.challenges.findUnique({
          where: { id },
          select: {
            creator_id: true
          }
        });

        if (challenge?.creator_id !== loggedInUserId){
          return res.status(403).json({error: "You can not edit this challenge"})
        }

        const dataToUpdate = {};
        const allowedFields = ["title", "description", "start_date", "end_date"];
        // loop through allowed fields. if field exists in req.body
        // if one or both of the time fields are passed
        // convert to the proper time format that the DB is expecting
        //any fields not passed are left as they were in the DB.
        //finally, we set each field that was passed into dataToUpdate
        for (let field of allowedFields){
          if(req.body[field] !== undefined) {
            if(field === "start_date" || field === "end_date"){
              if (req.body[field]){
                dataToUpdate[field] = new Date(req.body[field]).toISOString();
              } 
            } else {
              dataToUpdate[field] = req.body[field];
            }
          }
        }
        
        if(Object.keys(dataToUpdate).length === 0){
          return res.status(400).json({error: "No valid fields to update"})
        }
        const updatedChallenge = await prisma.challenges.update({
          where: { id },
          data: dataToUpdate,
          select: {
            id: true,
            title: true,
            description: true,
            start_date: true,
            end_date: true,
            created_at: true,
            creator_id: true,
          }
        })
    
        return res.json(updatedChallenge);
    
      } catch (error) {
        console.error(error);
         return res.status(400).json({error: "Failed to update the challenge"})
      }
}

//delete a challenge
exports. removeChallenge = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
     
        const deletedChallenge = await prisma.challenges.delete({
            where: { id },
            select: {
              id: true,
              title: true,
              description: true,
              start_date: true,
              end_date: true,
              created_at: true,
              creator_id: true,
            }
          })
    
         return res.json({message: "Challenge Removed", deletedChallenge});
    
      } catch (error) {
        console.error(error);
        return res.status(404).json({error: "No challenge found, failed to delete the challenge"})
      }
}

//join a challenge
exports.joinChallenge = async (req, res, next) => {
    try {
        const challengeId = parseInt(req.params.challengeId);
        const user_id = parseInt(req.body.user_id);
        const existingParticipant = await prisma.challenge_participants.findFirst({
          where: {
              user_id: user_id,
              challenge_id: challengeId
          }
        });
  
        if(existingParticipant){
          return res.status(400).json({error: "already joined"})
        }
        if (isNaN(challengeId)) {
          return res.status(400).json({ error: "Invalid challenge ID" });
        }
    
        // Add user to challenge participants
        const participant = await prisma.challenge_participants.create({
          data: {
            challenge_id: challengeId,
            user_id: user_id,
          },
        });
    
        return res.json({ message: "User joined the challenge", participant });
      } catch (error) {
        console.error(error);
        next(error);
      }
}

// leave a challenge
exports.leaveChallenge = async (req, res, next) => {
    try {
        const challengeId = Number(req.params.challengeId);
        const { user_id } = req.body;

        if (isNaN(challengeId) || isNaN(user_id)) {
            return res.status(400).json({ error: "Invalid challengeId or userId" });
        }

        // Check if the user is part of the challenge
        const participant = await prisma.challenge_participants.findFirst({
            where: {
                challenge_id: challengeId,
                user_id: user_id,
            },
        });

        if (!participant) {
            return res.status(404).json({ error: "User not found in this challenge" });
        }

        // Remove the user from the challenge (delete from challenge_participants table)
        await prisma.challenge_participants.delete({
            where: {
                user_id_challenge_id: {
                    user_id: user_id,
                    challenge_id: challengeId,
                }
            }
        });
        
        return res.json({ message: "User successfully removed from challenge" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to leave the challenge" });
    }
}



