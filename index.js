require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/router");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); 
require("./database/dbConnection");
const jwtMiddleware = require('./middleware/jwtMiddleware')

const User = require("./models/userModel"); 

const taskServer = express();
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// CORS configuration
taskServer.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
taskServer.use(express.json());
taskServer.use("/uploads", express.static("./uploads"));

// Session configuration
taskServer.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport initialization
taskServer.use(passport.initialize());
taskServer.use(passport.session());

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key-change-this";

// ✅ Generate JWT Token function
// function generateToken(user) {
//   console.log("🔹 Generating token for userId:", user.id);
//   return jwt.sign(
//     {
//       id: user.userId, 
//       email: user.email,
//       name: user.name,
//     },
//     JWT_SECRET,
//     { expiresIn: "24h" }
//   );
// }

// ✅ Middleware to verify JWT Token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Authentication required" });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid or expired token" });

//     req.user = user;
//     next();
//   });
// };

// ✅ Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 Google Profile:", profile);

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Google profile does not contain an email."));
        }

        // ✅ Check if user exists in database
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          // 🆕 Create new user if not found
          existingUser = new User({
            name,
            email,
            googleId,
          });

          await existingUser.save();
          console.log("✅ New user created:", existingUser);
        } else {
          console.log("✅ User already exists:", existingUser);
        }

        return done(null, existingUser);
      } catch (error) {
        console.error("❌ Google Auth Error:", error);
        return done(error);
      }
    }
  )
);

// ✅ Serialize/Deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id); // Store MongoDB _id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// ✅ Home route
taskServer.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

// ✅ Google OAuth Login Route
taskServer.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth Callback Route
taskServer.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("🔹 Google Auth Callback - User:", req.user);
    if (!req.user) {
      return res.status(401).send("Authentication failed");
    }

    // ✅ Generate Token with MongoDB _id
    const token = jwtMiddleware(req.user);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Redirect to frontend with token in URL
    res.redirect(`${frontendUrl}/tasks?token=${token}`);
  }
);

// ✅ Token Verification Endpoint
taskServer.get("/verify-token", jwtMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ✅ Logout Route
taskServer.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout failed");
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// ✅ Apply router
taskServer.use("/", router);

// ✅ 404 Handler
taskServer.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error Handler
taskServer.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
taskServer.listen(PORT, () => {
  console.log(`🚀 TASK-SERVER STARTED AT PORT ${PORT}`);
});
