import jwt from "jsonwebtoken";
export const verifyjwt = (req, res, next) => {
  if (!req.cookies) return res.status(401).json("no cookies");

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err || !info) return res.status(401).json({ err });
    req.userInfo = info;
    next();
  });
};
