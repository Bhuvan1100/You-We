
import jwt from "jsonwebtoken";
import User from "../models/Users";

const JWT_SECRET = "your-secret-key"; 


export const createToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

   
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    
    res.json({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
