const utilities = require("../utilities")
const classificationModel = require("../models/newClassification-Model")
const vehicleModel = require("../models/newVehicle-model")
const invModel = require("../models/inventory-model")
 
 
 
 
/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  req.flash("notice", "This is a flash message.")
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    Errors: null,
    classificationSelect
  })
}
 
async function addNewClassifacation(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("inventory/newClassifacation", {
    title: "Add New Classification",
    nav,
 
  })
}
 
async function addNewVehicle(req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  req.flash("notice", "This is a flash message.")
  res.render("inventory/newVehicle", {
    title: "Add New Vehicle",
    nav,
    classificationSelect
  })
}
 
/* ***************************
*  Build edit inventory view
* ************************** */
async function editVehicle(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/editVehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
 
/* ****************************************
*  Process Clasification
* *************************************** */
async function processNewClassification(req, res) {
  let nav = await utilities.getNav()
  const { new_classification } = req.body
  const regResult = await classificationModel.newClassifacation(
    new_classification,
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you add your new classification`
    )
    res.redirect('/inv')
  } else {
    req.flash("notice", "Sorry, your classification failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
 
 
/* ****************************************
*  Process vehicle
* *************************************** */
async function processNewVehicle(req, res) {
  let nav = await utilities.getNav()
  const { make, model, description, image_path, thumbnail_path, price, year, miles, color, classification_id } = req.body
  const regResult = await vehicleModel.newvehicle(
    make, model, description, image_path, thumbnail_path, price, year, miles, color, classification_id,
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new vehicle`
    )
    res.redirect('/inv')
  } else {
    req.flash("notice", "Sorry, your classification failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
 
/* ***************************
*  Update Inventory Data
* ************************** */
async function updateInventory(req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
 
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}
 
/* ***************************
*  Delete Inventory Data
* ************************** */
async function deleteView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete" + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}
 
async function deleteItem(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
 
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    ,res.redirect('/inv/')
    } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}
 
module.exports = {
  buildManagement,
  addNewClassifacation,
  addNewVehicle,
  processNewClassification,
  processNewVehicle,
  editVehicle,
  updateInventory,
  deleteView,
  deleteItem
}
 