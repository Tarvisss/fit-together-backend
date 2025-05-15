const express = require("express");
const cors = require("cors");
const path = require('path')
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const commentsRoutes = require("./routes/comments");
const challengesRoutes = require("./routes/challenges");
const likesRoutes = require("./routes/likes");
const quoteRoutes = require("./routes/quotes")
const { NotFoundError } = require("./middleware/errorHandling")

const app = express();

app.use(cors());
app.use(express.json());

app.use(quoteRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/challenges", challengesRoutes);
app.use("/challenges", commentsRoutes);
app.use("/likes", likesRoutes);  

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled gets passed into this function.*/

app.use(function (error, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(error.stack);
  const status = error.status || 500;
  const message = error.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
