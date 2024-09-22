import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Required fields is Missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: `User with ${email} already exist`,
        success: false,
      });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hasedPassword,
      role,
    });
    return res.status(201).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured Creating Account",
      error,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || role) {
      return res.status(400).json({
        message: "Something is Missing",
        success: false,
      });
    }
    let user = User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Credentials",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcom back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error Loggin",
      error,
      success: false,
    });
  }
};

export const loggout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Loging Out",
      error,
      success: false,
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, skills, bio } = req.body;
//     const file = req.file;

//     const skillsArray = skills.split(",");
//     const userId = req.id; // middleware authentication

//     let user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({
//         message: "User not found",
//         success: false,
//       });
//     }

//     (user.fullname = fullname || user.fullname),
//       (user.email = email || user.email),
//       (user.phoneNumber = phoneNumber || user.phoneNumber),
//       (user.profile.bio = bio || user.profile.bio),
//       (user.profile.skills = skillsArray),

//     // resume here

//       await user.save();

//     return res.status(200).json({});
//   } catch (error) {
//     console.log(error);
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, skills, bio } = req.body;
    const file = req.file;
    const userId = req.id; // middleware authentication

    // Convert skills to array
    const skillsArray = skills && skills.split(",");

    // Build the update object
    const updates = {};
    if (fullname) updates.fullname = fullname;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (bio) updates["profile.bio"] = bio;
    if (skillsArray) updates["profile.skills"] = skillsArray;

    // Check if there's something to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
        success: false,
      });
    }

    // update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
