const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
// 1 MIDDLEWARES
app.use(morgan('dev'));
// these more simple middleware functions apply to all request
app.use(express.json()); //middleware
// custom middleware
app.use((req, res, next) => {
  console.log(
    'Hello from middleware hehehe '
  );
  next(); // NEVER FORGET
});

app.use((req, res, next) => {
  req.requestTime =
    new Date().toISOString();

  next();
});
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    'utf-8'
  )
);
// 2 ROUTE HANDLERS
const getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    // jSend specification
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours: tours }, //enveloping
  });
};

const getTour = (req, res) => {
  // optional params are  ?(:test?) but other params need to be hit or error occurs
  // console.log(req.params);
  const id = +req.params.id;
  const tour = tours.find(
    (tour) => tour.id === id
  );
  if (id >= tours.length || !tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    // jSend specification
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId =
    tours[tours.length - 1].id + 1; //last id + 1
  const newTour = Object.assign(
    { id: newId },
    req.body
  );
  console.log(newTour);
  tours.push(newTour);
  // using async operation to ensure the event look is not blocked especially inside a callback function
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    'utf-8',
    (err) => {
      res.status(201); // 201 stands for created
      res.json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  // just verifying id
  const id = +req.params.id;
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // some logic for updating ........
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here........',
    },
  });
};
const deleteTour = (req, res) => {
  // just verifying id

  const id = +req.params.id;

  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // some logic for delete ........
  res.status(204).json({
    // A 204 status code is used when the server successfully processes the request, but there is no content to return to the client.
    // This is typically used for requests where the client wants to indicate that it has finished processing a request,
    // such as a DELETE request.
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not implemented yet',
  });
  // 500 - internal server error
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not implemented yet',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not implemented yet',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not implemented yet',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not implemented yet',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3 ROUTES
// these routers(middleware functions) only apply to a certain route

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
// order of middleware matters a lot
app.use((req, res, next) => {
  console.log(
    `i come after req and res cycle ends for the route /api/v1/tours...... so i wont be executed
     but since im defined before /api/v1/tours/:id middle function i will be executed'
  `
  );
  next(); // NEVER FORGET OR REQ RES CYCLE WILL BE PENDING
});
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
// 4 SERVER
const port = 3000;
app.listen(port, () => {
  console.log(
    `App  running on port : ${port}`
  );
});
