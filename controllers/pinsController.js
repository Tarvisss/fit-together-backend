const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Add pin to challenge
exports.addPinToChallenge = async (req, res) => {
  const challengeId = req.params.challengeId;
  const userId = req.user.userId;
  try {
    const pin = await prisma.likes.create({
      data: {
        challenge_id: challengeId,
        user_id: userId,
      },
    });
    res.json(pin);
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove pin from challenge
exports.removePinFromChallenge = async (req, res) => {
  const challengeId = req.params.challengeId;
  const userId = req.user.userId;

  try {
    await prisma.likes.delete({
      where: {
        user_id_challenge_id: {
          user_id: userId,
          challenge_id: challengeId,
        },
      },
    });
    res.json({ message: "pin removed" });
  } catch (error) {
    console.error("Error removing pin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
