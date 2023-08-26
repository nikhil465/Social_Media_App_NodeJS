const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "blahsomething",
  db: "codial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "forwork98236886@gmail.com",
      pass: "fwqpdkdgxxdnmpyn",
    },
  },
  google_client_id:
    "124630479612-8v8lhe90b5tkrlfriq8q2g008g4qu26n.apps.googleusercontent.com",
  google_client_secret: "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",
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codial",
  morgan: {
    mode: "dev",
    options: {
      stream: accessLogStream,
    },
  },
};

const production = {
  name: "production",
  asset_path: process.env.CODIAL_ASSET_PATH,
  session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
  db: process.env.CODIAL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODIAL_GMAIL_USERNAME,
      pass: process.env.CODIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.CODIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: {
      stream: accessLogStream,
    },
  },
};

module.exports =
  eval(process.env.CODIAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.CODIAL_ENVIRONMENT);
