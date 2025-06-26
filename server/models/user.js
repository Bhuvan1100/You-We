// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    default: function () {
      return "linkuser_" + Math.floor(1000 + Math.random() * 9000);
    },
    unique : true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  profilePhoto: {
    type: String,
    default: "https://api.dicebear.com/6.x/pixel-art/svg?seed=WeAndI"
  },
  authProvider: {
    type: String,
    enum: ["google", "email"],
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["online", "offline", "away", "busy"],
    default: "offline"
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  interests: {
    type: [String],
    default: []
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user"
  },
  blockedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
