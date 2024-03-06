const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
exports.aliasTopTours = (req, res, next) => {
  req.body.limit = '5';
  req.body.sort = '-ratingsAverage,price';
  req.body.fields = 'name,price,ratingsAverage,duration,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  // why pass Tour.find()
  // ref : https://chat.openai.com/c/8f18796f-9e4a-4ca3-9617-f7ca5122c278
  const features = new APIFeatures(Tour.find(), req.query);
  features.filter().sort().fields().page();
  const tours = await features.query;
  try {
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // end point : address/v1/tours/:id
    // id is a parameter
    const tour = await Tour.findById(req.params.id);

    // same as Tour.findOne({"_id" : ObjectID(req.params.id)})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const tour = new Tour(req.body);
    // tour.save()
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    // mongoose takes care of string->ObjectId
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // findByIdAndUpdate(filter,project,options{return new doc,run validation based on schema})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    // const tour =  Tour.deleteOne({"_id ": req.params.id}).exec();
    const tour = await Tour.findByIdAndDelete(req.params.id);
    // HTTP Status 204 (No Content) indicates that the server has successfully fulfilled the request and
    // that there is no content to send in the res  ponse payload body.
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

// Original code
// a sample query string : api/v1/tours/?duration=5&difficulty=easy&name=test
// req.query = {duration : 5 , difficulty : 'easy' , name : 'test'}
// Tours.find(req.query) will give us the documents based on filter object passed
// but not all properties on query string related to fields of document
// example page,  limit
// another way is to chain methods
// Tour.find().where('duration).equals(5).where('difficulty').equals(5).where('name).equals(test)

//  // 1)filtering
//     // making shallow copy (temporary object)
//     const queryObj = { ...req.query };

//     // some fields for which we do not want to filter but use for other features hence they must be excluded
//     const excludedFields = ['page', 'limit', 'sort', 'fields'];
//     excludedFields.forEach((field) => {
//       delete queryObj[field];
//     });
//     // since all the excluded fields which actually exist on the queryObj
//     // will be deleted so that only the data related to filter is now present which we can query in db
//     // in query Obj example : queryObj : {page : 4 , name : 'xyz',limit=2,duration : 5}
//     // after deleting queryObj {name : 'xyz' ,duration : 5}

//     // also we cannot here directly await since it will execute the query
//     // we want to build the query for all features then only execute
//     // const tour = await Tour.find(queryObj);
//     // find returns array

//     // query string with operators
//     // standard way : api/v1/tours?duration[gt]=5&difficulty[lte]=4
//     // greater than 5 and less than equal to 4
//     // in req.query this is transformed as
//     // {duration : {gt : 5} , difficulty : {lte : 4}}
//     // but for mongodb the syntax is
//     // {duration : {$gt : 5}, difficulty : {$lte : 4}}
//     // hence we need to match (gt|gte|lt|lte) and replace them with prepend of $

//     // BUILD THE QUERY

//     // Advanced Filtering
//     // this is done to include operators in filter object
//     let queryString = JSON.parse(queryObj);

//     queryString = queryString.replace(
//       /\b(gte|gt|lte|lt k)\b/g,
//       (match) => `$${match}`
//     );
//     // convert back to object
//     queryString = JSON.parse(queryString);
//     // in callback  replace returns matched string for all matches

//     // 1st build(fields + ?operator)filter
//     // Now our query does not only match with the request fields
//     // but also with their operators
//     // in case there are no operators then queryString will be same as original reqObject

//     let query = Tour.find(queryString);

//     // 2nd sort
//     // for req.query to not be overwritten we created a shallow copy
//     // hence req.query still has excluded fields as  properties
//     // if we have multiple criteria in query like ?sort=price,ratingsAverage
//     // the object would appear as {sort : price,ratingsAverage}
//     // mongoose accepts sort('price ratingsAverage')
//     // hence we remove , which means sort : {priceratingsAverage}
//     // replace it with space which means sort : {price ratingsAverage}

//     // 2nd build ( + sorting)
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//       // accepts string separated by properties
//     } else {
//       // default : descending order of createdAt
//       query = query.sort('-createdAt');
//     }

//     // 3rd build (+ field limiting) / projecting
//     // this allows users to get back only the fields they want
//     // sample query  : api/v1/tours/fields=name,price,duration
//     // same as sorting but using select()
//     // side not we can also exclude fields from schema by select : false
//     if (req.query.fields) {
//       const limitBy = req.query.fields.split(',').join(' ');
//       query = query.select(limitBy);
//     }

//     // 4th build Pagination (page + limit field)
//     //  skip(no of results to skip) & limit (no of results to limit to)
//     // since we using default values no need of checking if page exists in search query

//     const limit = +req.query.limit || 5;
//     const page = +req.query.page || 1;
//     const skip = (page - 1) * limit;
//     query.skip(skip).limit(limit);

//     // if the requested page does not exist
//     // example :  total results : 9
//     // requested page 4 limit 3
//     // skipped 9
//     if (req.query.page) {
//       // independent of query
//       const totalDocuments = await Tour.countDocuments();
//       if (totalDocuments <= skip) {
//         throw new Error('Page does not exist');
//       }
//     }
//     // EXECUTE QUERY
//     const tours = await query;
