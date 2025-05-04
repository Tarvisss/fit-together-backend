const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

/**Use Bcrypt to salt and hash the users entered password
 * we store the password as hsahedPassword in our database.
 Register a new User*/ 
exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, email } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { username }});
        if(existingUser){
            return res.status(400).json({error: "Username taken!"})
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
        const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY)
        // here we create a safeUser that doesn't contain the password
        // Use "_" as a placeholder so that the json response will not have the password
        const { password:_, ...safeUser } = user
        //make sure to wrap both safeUser and token in {},
        //otherwise only on argument will be returned. 
        res.status(201).json({safeUser, token});
    } catch (error) {
        next(error);
    }
};

// LOGIN user
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

      const user = await prisma.users.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
          }
      
          const isValid = await bcrypt.compare(password, user.password);
      
          if (!isValid) {
            return res.status(400).json({ error: "Invalid username or password" });
          }
          const token = jwt.sign({user: user.id}, process.env.SECRET_KEY)
          // here we create a safeUser that doesn't contain the password
          // Use "_" as a placeholder so that the json response will not have the password
          const { password:_, ...safeUser} = user;
        res.json({safeUser, token});
    } catch (error) {
        next(error); 
    }
};
