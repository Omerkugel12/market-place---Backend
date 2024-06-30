const User = require("../models/user.model");

async function getUserById(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      console.log(
        `user.controller, getUserById. User not found with id: ${id}`
      );
      return res.status(404).json({ message: "User not found" });
    }
    console.log(
      `user.controller, getUserById. Error while getting user with id: ${id}`,
      error.name
    );
    res.status(500).json({ message: error.mesagge });
  }
}

module.exports = {
  getUserById,
};
