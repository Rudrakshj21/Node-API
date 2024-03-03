const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
// parameterized middleware handler

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);

  if (+req.params.id >= tours.length) {
    /*
    very crucial that this returns (end program) as once the response has been send (res.json)
    one req-res cycle is done and we do not need to call next() middleware 
    */
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
// since tours is being used here no need to export
// 2 ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    // jSend specification
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours: tours }, //enveloping
  });
};

exports.getTour = (req, res) => {
  // optional params are  ?(:test?) but other params need to be hit or error occurs
  // console.log(req.params);
  // const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === +req.params.id);
  // if (id >= tours.length || !tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  res.status(200).json({
    // jSend specification
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1; //last id + 1
  const newTour = Object.assign({ id: newId }, req.body);
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
exports.updateTour = (req, res) => {
  // just verifying id
  // const id = +req.params.id;
  // // if (id >= tours.length) {
  // //   return res.status(404).json({
  // //     status: 'fail',
  // //     message: 'Invalid ID',
  // //   });
  // // }
  // some logic for updating ........
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here........',
    },
  });
};
exports.deleteTour = (req, res) => {
  // just verifying id

  // const id = +req.params.id;

  // if (id >= tours.length || id < 0) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // some logic for delete ........
  res.status(204).json({
    // A 204 status code is used when the server successfully processes the request, but there is no content to return to the client.
    // This is typically used for requests where the client wants to indicate that it has finished processing a request,
    // such as a DELETE request.
    status: 'success',
    data: null,
  });
};
