// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const manageController = require("../controllers/manageController");
const utilities = require("../utilities");

// CORRECT FORMAT router.get(some_text, a_function(), another_function(), a_function(with_parameter));
// router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by classification view
router.get("/detail/:invId", invController.buildByInvId);

router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(manageController.buildManagement)
);

// New Classification
router.get(
  "/newClassifacation",
  utilities.handleErrors(manageController.addNewClassifacation)
);
// New Vehivle
router.get(
  "/newVehicle",
  utilities.handleErrors(manageController.addNewVehicle)
);
// post new classification
router.post(
  "/newClassifacation",
  utilities.handleErrors(manageController.processNewClassification)
);
// post new vehicle
router.post(
  "/newVehicle",
  utilities.handleErrors(manageController.processNewVehicle)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(manageController.editVehicle)
);

router.post(
  "/update/",
  utilities.handleErrors(manageController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(manageController.deleteView)
);

router.post("/delete", utilities.handleErrors(manageController.deleteItem));

router.post("/addReview", utilities.handleErrors(invController.addReview));

module.exports = router;
