const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const connectDB = require("./database/database");
connectDB();
const passport = require("passport");
const cookieSession = require("cookie-session");

const app = express();

require("./middlewares/auth");

app.set("view engine", "ejs");

//Setting up cookies
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use((req, res, next) => {
  console.log("sd", req.session);
  console.log("e", req.session.regenerate);
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      return cb();
    };
    if (req.session && !req.session.save) {
      req.session.save = (cb) => {
        return cb();
      };
    }
    next();
  }
});

//Logged In Middleware
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

//Passport Initialized
app.use(passport.initialize());

//Setting Up Session
app.use(passport.session());

const PORT = process.env.PORT || 4400;

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/failed", (req, res) => res.send("You Failed to log in!"));

app.get("/good", (req, res) => {
  console.log(req.user.photos[0].value);

  res.render("pages/profile.ejs", {
    name: req.user.displayName,
    pic: req.user._json.picture,
    email: req.user.emails[0].value,
    profile: "google",
  });
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  (req, res) => {
    res.redirect("/good");
  }
);

app.get("/profile", (req, res) => {
  console.log("----->", req.user);
  res.render("pages/profile.ejs", {
    profile: "facebook",
    name: req.user.displayName,
    pic: req.user.photos[0].value,
    email: req.user.emails[0].value, // get the user out of session and pass to template
  });
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// app.get('/auth/linkedin',
//     passport.authenticate('linkedin', {
//         scope : ['r_emailaddress', 'r_liteprofile']
//     }
// ));

// app.get('/auth/twitter',
//     passport.authenticate('twitter', {
//         scope : 'email'
//     }
// ));

// app.get('/linkedin/callback',
//     passport.authenticate('linkedin', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }
// ));

// app.get('/twitter/callback',
//     passport.authenticate('linkedin', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }
// ));

app.get("/logout", (req, res) => {
  // req.session.destroy()
  // req.logout()
  res.send("Goodbye!!!");
});



app.all("*", (req, res) => {
  res.json({
    message: `this route (${req.originalUrl}) does not exist `,
  });
});

// app.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });

app.listen(PORT, () => {
  console.log(`Server is up on : ${PORT}`);
});
