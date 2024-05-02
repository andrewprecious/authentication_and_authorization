const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const auth_header = req.headers.token;
  if (auth_header) {
    const security_token = auth_header.split(" ")[1];

    jwt.verify(
      security_token,
      process.env.JWT_SEC,
      (err, decoded_user_info) => {
        if (err) {
          return res.status(400).json({
            message: "We are unable to verify the security of the given token",
          });
        }

        req.user = decoded_user_info;
        next();
      }
    );
  } else {
    return res.status(401).json("Unauthenticated User");
  }
};

// authorization
const verifyTokenAndOwnerOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Access Denied due to lack of permission" });
    }
  });
};

// multi level authority
const verifyAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Permission Granted only to Licensed Personnel" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndOwnerOrAdmin,
  verifyAndAdmin,
};
