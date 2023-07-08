import jwt from "jsonwebtoken";
export const verifyjwt = (req, res, next) => {
  if (!req.cookies) res.status(401).json("no cookies");

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) res.status(401).json("Invalid token");
    req.userInfo = info;
    next();
  });
};
