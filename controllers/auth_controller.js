const User = require("../model/user_model");
const validator = require("validator");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// function to encrypt password
const encryptPassword = (password) => {
  return CryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString();
};

// function to encrypt password
const decryptPassword = (password) => {
  return CryptoJs.AES.decrypt(password, process.env.PASS_SEC).toString(
    CryptoJs.enc.Utf8
  );
};

// register page
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if all the field are filled
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email is existing
    const checkIfEmailIsExisting = await User.findOne({ email: email });
    if (checkIfEmailIsExisting) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    // check if email is existing
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "This email is not valid" });
    }

    // creating a new user
    const newUser = new User({
      username: username,
      email: email,
      password: encryptPassword(password),
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    // get email and password from the form
    const { email, password } = req.body;

    //  checks if email is existing
    const email_is_present = await User.findOne({ email: email });
    if (!email_is_present) {
      return res
        .status(400)
        .json({ message: "Email is not listed in our system" });
    }

    // decryptes the encrypted password from our database
    const decrypt_result = decryptPassword(email_is_present.password);

    // checks if the decrypted password matches the password the user typed in
    const user_input_password = decrypt_result === password;
    if (!user_input_password) {
      return res
        .status(400)
        .json({ message: "Unauthorized Access Not Allowed" });
    }

    // creates an identity token
    const identity_token = jwt.sign(
      { id: email_is_present._id, isAdmin: email_is_present.isAdmin }, // user information
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );

    // extracting the password before sending response
    const { password: entry_key, ...others } = email_is_present._doc;

    res.status(200).json({ ...others, identity_token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Not Responding" });
  }
};

module.exports = { registerUser, loginUser };
