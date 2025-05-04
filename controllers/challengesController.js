const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient();

//get a list if challenges
exports.getChallenges = async (req, res, next) => {
    try {
        const challenges = await prisma.challenges.findMany();
        res.json(challenges);
    } catch (err) {
        next(err);
    }
    
}
//get a single challenge
exports.getChallenge = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "Invalid ID format"})
        }
        const challenge = await prisma.challenges.findUnique({
            where: { id },
        });

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        res.json(challenge); 
    } catch (error) {
        next(error); 
    }
}

//create a new challenge
exports.createChallenge = async (req, res, next) => {
    try {
      console.log('Decoded user:', req.user);
        const {title, description, start_date, end_date, created_at} = req.body;
        //setting the users id to the creator id for the created challenge
        //Decoded user: { user: 3, iat: 1746371044 } this is reason for req.user.user

        const creator_id = req.user.user;

        const newChallenge = await prisma.challenges.create({
            data: {title, description, start_date, end_date, created_at, creator_id},
        });

        res.status(201).json(newChallenge);
    } catch (error) {
        next(error);
        
    }
}

//udate challenge details
exports.updateChallenge = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
    
        if(isNaN(id)){
            return res.status(400).json({ error: "Invalid ID format"})
        }
        const dataToUpdate = {};
        const allowedFields = ["title", "description", "start_date", "end_date"];
        for (let field of allowedFields){
          if(req.body[field] !== undefined) {
            dataToUpdate[field] = req.body[field];
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
    
        res.json(updatedChallenge);
    
      } catch (error) {
        console.error(error);
        res.status(400).json({error: "Failed to update the challenge"})
      }
}

//delete a challenge
exports. removeChallenge = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
     
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
    
        res.json({message: "Challenge Removed", deletedChallenge});
    
      } catch (error) {
        console.error(error);
        res.status(404).json({error: "No challenge found, failed to delete the challenge"})
      }
}

//join a challenge
exports.joinChallenge = async (req, res, next) => {
    try {
        const challengeId = Number(req.params.challengeId);
        const user_id = req.body.user_id;
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
    
        res.json({ message: "User joined the challenge", participant });
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
        
        res.json({ message: "User successfully removed from challenge" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to leave the challenge" });
    }
}



