const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ***************************
 *  Build edit account view
 * ************************** */
async function editAccountInfo(req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id);
    const accountData = await accountModel.getAccountById(account_id);
    if (!accountData) {
      throw new Error("Account not found");
    }
    // Render the edit account page
    res.render("account/editAccount", {
      title: "Edit Account",
      nav: await utilities.getNav(),
      account: accountData,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
    return;
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Deliver logged in view
 * *************************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("account/accountmanagement", {
    title: "Account Management",
    nav,
    errors: null,
    classificationSelect,
  });
}

/* ****************************************
 *  Log out
 * *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = "";
  return res.redirect("/");
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
      });
      return res.redirect("/account");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", `Your account was successfully updated.`);
    res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  accountLogout,
  editAccountInfo,
  updateAccount,
};
