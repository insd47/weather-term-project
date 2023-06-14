// include env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.set("port", 80);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

// routes
app.use(express.static("./public")); // static files
app.use("/", require("./routes/pages"));
app.use("/api", require("./routes/api"));

app.use((req, res, next) => {
  // 404 error
  const err = new Error("Not Found");
  err.status = 404;

  res.status(404).redirect(
    "/error?type=RequestError&details=" +
      JSON.stringify({
        code: 404,
        message: "페이지를 찾을 수 없습니다",
      })
  );

  next(err);
});

// start app
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "로 서버가 열렸습니다.");
});
