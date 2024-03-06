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
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
//   convention to use name as router
module.exports = router;
