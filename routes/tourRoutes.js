const tourController = require('./../controllers/tourController');
const router = express.Router();
const { checkID } = require('../controllers/tourController');

// parameterized middleware which only gets executed if :
// 1) route is for this url
// 2) id has been specified
router.param('id', checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(Controller.updateTour)
  .delete(tourController.deleteTour);

//   convention to use name as router
module.exports = router;
