const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");

require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = `
    <div class="container">
      <img class="img-inv" src="${data[0].inv_image}">
      <div class="container-large">
        <h1 class="sec-title">${data[0].inv_make} ${
      data[0].inv_model
    } Details</h1>
        <p class="price">Price: $${Number(
          data[0].inv_price
        ).toLocaleString()}</p>
        <p class="details">${data[0].inv_description}</p>
        <p class="color">Color: ${data[0].inv_color}</p>
        <p class="miles">Miles: ${Number(
          data[0].inv_miles
        ).toLocaleString()} Miles</p>
      </div>
    </div>
    `;
  }
  return grid;
};

Util.getSingleView = async function (data) {
  let singleView = `
  <div class="single-view">
    <!-- Car Image -->
    <div class="car-image">
      <img src="${data[0].inv_image}" alt="Car Image">
    </div>

    <!-- Car Details -->
    <div class="car-details">
      <h2>Year: ${data[0].inv_year}</h2>
      <p>Price: $${Number(data[0].inv_price).toLocaleString()}</p>
      <p>Mileage: ${Number(data[0].inv_miles).toLocaleString()}</p>
      <p>Color: ${data[0].inv_color}</p>
    </div>
  </div>`;

  return singleView;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.checkAccountType = (req, res, next) => {
  if (!res.locals.accountData) {
    return res.redirect("/account/login");
  }
  if (
    res.locals.accountData.account_type == "employee" ||
    res.locals.accountData.account_type == "admin"
  ) {
    next();
  } else {
    return res.redirect("/account/login");
  }
};

module.exports = Util;
