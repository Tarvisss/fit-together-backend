const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { BadRequestError } = require("../middleware/errorHandling")

/**Use Bcrypt to salt and hash the users entered password
 * we store the password as hsahedPassword in our database.
 Register a new User*/ 
exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, email } = req.body;

        if (!username || !password || !first_name || !last_name || !email) {
            throw new BadRequestError("All fields required!");
        }
        if (username.length < 3) {
            throw new BadRequestError("Username must be at least 3 characters long!");
        }
        const existingEmail = await prisma.users.findUnique({ where: { email } });

        if (existingEmail) {
            throw new BadRequestError("This email has already registered");
        }

        const existingUsername = await prisma.users.findUnique({ where: { username }});
        if(existingUsername){
            throw new BadRequestError("Username taken!")
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await prisma.users.create({
            data: { 
                username, 
                password: hashedPassword, 
                first_name, 
                last_name, 
                email },
        });

        // jwt.sign() creates a JWT containing the user's ID and username in the payload, 
        // signed with a secret key (process.env.SECRET_KEY). 
        // This token is used for secure authentication and ensures that only the server can verify its integrity.
        const token = jwt.sign({userId: user.id, username: user.username}, process.env.SECRET_KEY)
        // here we create a safeUser that doesn't contain the password
        // Use "_" as a placeholder so that the json response will not have the password
        const { password:_, ...safeUser } = user
        //make sure to wrap both safeUser and token in {},
        //otherwise only on argument will be returned. 
        return res.status(201).json({safeUser, token});
    } catch (error) {
        next(error);
    }
};

// LOGIN user
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            throw new BadRequestError("All fields required!")
        }
        const user = await prisma.users.findUnique({
            where: { username },
        });
        
        if (!user) {
            throw new BadRequestError("Invalid username or password");
          }
      
          const isValid = await bcrypt.compare(password, user.password);
      
          if (!isValid) {
            throw new BadRequestError("Invalid username or password");
          }
          const token = jwt.sign({userId: user.id, username: user.username}, process.env.SECRET_KEY)
          // here we create a safeUser that doesn't contain the password
          // Use "_" as a placeholder so that the json response will not have the password
          const { password:_, ...safeUser} = user;
        return res.json({safeUser, token});
    } catch (error) {
        next(error); 
    }
};
