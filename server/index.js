const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const session = require("express-session");

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Init express
const app = express();

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // Init session store for logged in user
  app.use(
    session({
      store: new session.MemoryStore(),
      secret: "I am an alcoholic. Please send help",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86399999,
      },
    })
  );

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

  // Answer API requests.
  app.use("/user", require("./routes/user"));
  app.use("/titles", require("./routes/titles"));

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "../react-ui/build", "index.html")
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
