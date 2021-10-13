const express = require('express');
const controllers = require('../controllers/subscriptionController/subscription');

const router = express.Router();

router
  .route('/')
  .get(controllers.getAllSubscribers)
  .post(controllers.createSubscriber);

router
  .route('/:id')
  .get(controllers.getSubscriber)
  .patch(controllers.updateSubscriber)
  .delete(controllers.deleteSubscriber);

module.exports = router;
