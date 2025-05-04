const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// get a list of users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// get a single user
exports.getUser = async (req, res, next) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                username: req.params.username
            },
            select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
            },    
        });

        if (!user){
            return res.status(404).json({error: "no user found"})
        }

        res.json(user)
    } catch (error) {
        next(error);
    }
};

// update user info
exports.updateUser = async (req, res, next) => {
    try {
        const {username} = req.params;
        const dataToUpdate = {};
        const allowedFields = ["username", "first_name", "last_name", "email"];
        for (let field of allowedFields){
          if(req.body[field] !== undefined) {
            dataToUpdate[field] = req.body[field];
          }
        };
        
        if(Object.keys(dataToUpdate).length === 0){
          return res.status(400).json({error: "No valid fields to update"})
        };
        const updatedUser = await prisma.users.update({
          where: {username},
          data: dataToUpdate,
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        });
    
        res.json(updatedUser);
    
    } catch (error) {
        next(error);
    };
};

// delete a user
exports.deleteUser = async (req, res, next) => {
    try {
        const {username} = req.params;
     
        const deletedUser = await prisma.users.delete({
          where: {username},
          select: {
            id: true,            username: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        });
    
        res.json({message: "User deleted", deletedUser});
    
    } catch (error) {
        next(error);
    };
};
