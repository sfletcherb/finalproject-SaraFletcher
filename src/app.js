const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionsRouter = require("./routes/sessions.router.js");
const cookiesRouter = require("./routes/cookies.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
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
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://saflebri:coderhouse@cluster0.1fc01sx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);
// Using passport for authentication
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", cookiesRouter);

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
