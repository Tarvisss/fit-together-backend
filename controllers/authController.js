const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { BadRequestError } = require("../middleware/errorHandling")

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure you have the correct Google client ID in your .env
/**Use Bcrypt to salt and hash the users entered password
 * we store the password as hsahedPassword in our database.
 Register a new User*/ 
exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, email } = req.body;
        const profileImage = req.file;

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

        const imageUrl = profileImage ? `/uploads/${profileImage.filename}` : null;

        const user = await prisma.users.create({
            data: { 
                username: String(username), 
                password: hashedPassword, 
                first_name: String(first_name), 
                last_name: String(last_name), 
                email: String(email),
                imageUrl 
            },
        });

        // jwt.sign() creates a JWT containing the user's ID and username in the payload, 
        // signed with a secret key (process.env.SECRET_KEY). 
        // This token is used for secure authentication and ensures that only the server can verify its integrity.
        const token = jwt.sign({userId: user.id, username: user.username, profilePic: user.imageUrl}, process.env.SECRET_KEY)
        // here we create a safeUser that doesn't contain the password
        // Use "_" as a placeholder so that the json response will not have the password
        const { password:_, ...safeUser } = user
        //make sure to wrap both safeUser and token in {},
        //otherwise only on argument will be returned. 
        return res.status(201).json({safeUser, token});
    } catch (error) {
        console.error("❌ Registration error:", error);
        return res.status(400).json({ error: error.message });
    }
};

// LOGIN user
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            throw new BadRequestError("All fields required!")
        }

        if (typeof username !== "string" || typeof password !== "string") {
            throw new BadRequestError("Username and password must be strings");
          }
        const user = await prisma.users.findUnique({
            where: { username },
        });
        
        if (!user || !user.password) {
            throw new BadRequestError("Please sign in with Google.");
}
      
          const isValid = await bcrypt.compare(password, user.password);
      
          if (!isValid) {
            throw new BadRequestError("Invalid username or password");
          }
          const token = jwt.sign({userId: user.id, username: user.username, profilePic: user.imageUrl}, process.env.SECRET_KEY)
          // here we create a safeUser that doesn't contain the password
          // Use "_" as a placeholder so that the json response will not have the password
          const { password:_, ...safeUser} = user;
        return res.json({safeUser, token});
    } catch (error) {
        next(error); 
    }
};

// Google OAuth login and sign up
exports.googleAuth = async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await prisma.users.findUnique({
      where: { email },
    });

    // If the user doesn't exist, create a new one (sign-up)
    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          username: payload.name.replace(/\s+/g, '_'), // Use Google name or customize
          first_name: payload.given_name || '',
          last_name: payload.family_name || '',
          imageUrl: payload.picture || null,
        },
      });
    }

    // Issue a JWT token for the user
    const authToken = jwt.sign(
      { userId: user.id, username: user.username, profilePic: user.imageUrl },
      process.env.SECRET_KEY
    );

    // Return the token and user data excluding the password (not stored in DB in this case)
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ safeUser, authToken });

  } catch (error) {
    console.error("❌ Google Authentication error:", error);
    return res.status(500).json({ error: "Google authentication failed" });
  }
};