const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by inventory_id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;

  let nav = await utilities.getNav();
  const data = await invModel.buildByInvId(inv_id);
  console.log(data);
  const vehicleName =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  const singleView = await utilities.getSingleView(data);

  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    singleView,
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 *  Deliver management view
 * *************************************** */
invCont.buildInvMangementView = async (req, res, next) => {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/invDisplay", {
    title: "Manage Inventory",
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.addReview = async (req, res) => {
  console.log(req, res);
  let nav = await utilities.getNav();
  const { review_text, review_screen_name, inv_id } = req.body;
  res.status(500).render("./inventory/detail/", {
    title: nav,
    errors: null,
  });
  const regResult = await invModel.addReview(
    review_text,
    review_screen_name,
    inv_id
  );
};

/* ****************************************
 *  Build vehicle comparison view
 * *************************************** */
invCont.buildCompareView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const vehicleSelect = await utilities.buildVehicleSelect();
  
  res.render("./inventory/compare", {
    title: "Compare Vehicles",
    nav,
    vehicleSelect,
  });
};

/* ****************************************
 *  Get vehicle comparison data
 * *************************************** */
invCont.getComparisonData = async function (req, res, next) {
  const vehicle1Id = parseInt(req.params.vehicle1Id);
  const vehicle2Id = parseInt(req.params.vehicle2Id);

  try {
    const vehicle1 = await invModel.buildByInvId(vehicle1Id);
    const vehicle2 = await invModel.buildByInvId(vehicle2Id);

    if (!vehicle1[0] || !vehicle2[0]) {
      return res.status(404).json({ error: "One or both vehicles not found" });
    }

    res.json({
      vehicle1: vehicle1[0],
      vehicle2: vehicle2[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
