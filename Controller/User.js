const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createUserValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

// I set the user active true at create time
exports.postCreateUser = async (req, res) => {
  try {
    const validateRequest = createUserValidation.validate(req.body);
    if (validateRequest.error) {
      console.log(validateRequest.error.details);
      return res
        .status(400)
        .json({ status: "fail", message: validateRequest.error.message });
    }

    const userIsExit = await User.findOne({email: req.body.email});
    if (userIsExit) {
      return res.status(404).json({ message: "User is already exits" });
    }

    const user = new User({
      ...req.body,
      isActive: true
    });

    const result = await user.save()
    return res
        .status(200)
        .json({ message: "User created succesfully", user: result });
  } catch (error) {
    console.log("create user", error.message, error);
    res.status(500).json({ message: "Internal sever error" });
  }
};

// exports.registerUser = async (req, res) => {
//   try {
//     const validateRequest = registerUserValidation.validate(req.body);
//     if (validateRequest.error) {
//       console.log(validateRequest.error.details);
//       return res
//         .status(400)
//         .json({ status: "fail", message: validateRequest.error.message });
//     }
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.isActive = true;
//     user.password = password;
//     await user.save();
//     res.status(200).json({ message: "User registerd successfully" });
//   } catch (error) {
//     console.log("Register user", error.message);
//     res.status(500).json({ message: "Internal sever error" });
//   }
// };

exports.postLoginUser = async (req, res) => {
  console.log('in')
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      if (user.isActive) {
        const { password, ...other } = user._doc;
        const token = jwt.sign(other, process.env.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        res.status(200).json({ token, userData: other });
      } else {
        res
          .status(400)
          .json({ message: "Please verify you account with provided email" });
      }
    } else {
      res.status(400).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log("login user", error.message);
    res.status(500).json({ message: "Internal sever error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ });

    res.status(200).json({ users });
  } catch (error) {
    console.log("get All User", error.message);
    res.status(500).json({ message: "Internal sever error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("get user by id", error.message);
    res.status(500).json({ message: "Internal sever error" });
  }
};

exports.deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findByIdAndDelete(req.params.id).session(session);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    await session.commitTransaction();
    res.status(200).json({ message: "User is deleted successfully", user });
  } catch (error) {
    console.log("get user by id", error.message);
    res.status(500).json({ message: "Internal sever error" });
  } finally {
    await session.endSession();
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const keys = Object.keys(req.body);

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    keys.forEach((key) => {
      user[key] = req.body[key];
    });

    const result = await (
      await user.save()
    )

    res
      .status(200)
      .json({ message: "Details is updated successfully", user: result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server error" });
  }
};
