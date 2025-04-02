// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = {
//           googleId: profile.id,
//           username: profile.displayName,
//           email: profile.emails ? profile.emails[0].value : "",
//           avatar: profile.photos ? profile.photos[0].value : "",
//         };

//         const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
//         if (!jwtSecret) {
//           throw new Error("❌ JWT secret key is missing");
//         }

//         const token = jwt.sign(user, jwtSecret, { expiresIn: "1d" });

//         console.log("✅ Generated Token:", token);

//         return done(null, { user, token });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// // Serialize user
// passport.serializeUser((data, done) => {
//   done(null, data);
// });

// // Deserialize user
// passport.deserializeUser((data, done) => {
//   done(null, data);
// });

// export default passport;
