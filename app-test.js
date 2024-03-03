// all middleware/express configuration
const express = require("express");
const morgan = require("morgan");

const app = express();
// 1 MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// these more simple middleware functions apply to all request
app.use(express.json()); //middleware
// custom middleware
app.use((req, res, next) => {
  console.log("Hello from middleware hehehe ");
  next(); // NEVER FORGET
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3 ROUTES
// these routers(middleware functions) only apply to a certain route
// Mounting new routers on a route

const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

module.exports = app;
