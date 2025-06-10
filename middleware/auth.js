require("dotenv").config();

const API_KEY = process.env.API_KEY; // In production, use environment variables

const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized - Invalid API Key" });
  }

  next();
};

module.exports = authenticate;
