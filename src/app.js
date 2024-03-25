const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const MongoStore = require("connect-mongo");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionsRouter = require("./routes/sessions.router.js");
require("./database.js");
const ProductModel = require("./models/products.model.js");
const MessageModel = require("./models/message.model.js");
const {
  addProduct,
  deleteProduct,
  addProductInCart,
} = require("./utils/get.products.js");

const app = express();
const PUERTO = 8080;

//Set up Express Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const secretKey = "coderHouse";
app.use(cookieParser(secretKey));
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    /* store: new fileStore({ path: "./src/sessions", ttl: 10000, retries: 1 }), */
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://saflebri:coderhouse@cluster0.1fc01sx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

//Routes:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

//Cookie Routes:
/* app.get("/setCookie", (req, res) => {
  res
    .cookie("coderCookie", "my first cookie", { maxAge: 10000 })
    .send("my first cookie!");
});
app.get("/getCookie", (req, res) => {
  res.send(req.cookies); // if I only want a specific cookie req.cookies.nombre_de_la_cookie
});
app.get("/deleteCookie", (req, res) => {
  res.clearCookie("coderCookie").send("Cookie deleted");
});
app.get("/signedCookie", (req, res) => {
  res
    .cookie("signedCookie", "my first signed cookie", { signed: true })
    .send("my first signed cookie!");
});
app.get("/recoverySignedCookie", (req, res) => {
  const valueCookie = req.signedCookies.signedCookie; // name of the signed cookie "signedCookie"
  if (valueCookie) {
    res.send("recovered cookie");
  } else {
    res.send("invalid Cookie");
  }
}); */

// Session Routes:
/* app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send("Welcome to session again for " + req.session.counter + " veces");
  } else {
    req.session.counter = 1;
    res.send("Welcome for visit us");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.send("Closed session");
    else res.send("There is an error", err);
  });
});

app.get("/login", (req, res) => {
  let { usuario, password } = req.query;
  if (usuario === "adminCoder@coder.com" && password === "1234") {
    req.session.user = usuario; // create session
    req.session.admin = true;
    res.send("SuccessFul login");
  } else {
    res.send("Login error");
  }
});

function auth(req, res, next) {
  if (req.session.admin === true) {
    return next();
  }
  return res.status(403).send("Authorizing error");
}

app.get("/privado", auth, (req, res) => {
  res.send("Authorized, you are admin authenticated");
}); */

//Listen:
const httpServer = app.listen(PUERTO, () => {
  console.log(`listening on port ${PUERTO}`);
});

//Socket.io:
const io = new socket.Server(httpServer);

io.on("connection", async (socket) => {
  console.log("A client has connected");

  socket.on("greeting", (data) => {
    console.log(data);
  });

  socket.on("message", async (data) => {
    await MessageModel.create(data);
    const messages = await MessageModel.find();
    io.sockets.emit("message", messages);
  });

  try {
    const data = await ProductModel.find();
    io.sockets.emit("updateProductList", data);
  } catch (error) {
    console.log("could not read ", error);
    throw error;
  }

  socket.on("addProduct", async (data) => {
    const newData = data;
    try {
      await addProduct(newData);
      const data = await ProductModel.find();
      io.sockets.emit("updateProductList", data);
    } catch (error) {
      console.log("could not update ", error);
      throw error;
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await deleteProduct(productId);
      const data = await ProductModel.find();
      io.sockets.emit("updateProductList", data);
    } catch (error) {
      console.log("could not delete ", error);
      throw error;
    }
  });

  socket.on("addProductInCart", async (productId) => {
    try {
      await addProductInCart(productId);
    } catch (error) {
      console.log("could not delete ", error);
      throw error;
    }
  });
});
