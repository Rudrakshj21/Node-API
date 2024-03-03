const tourController = require('./../controllers/tourController');
const router = express.Router();

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
