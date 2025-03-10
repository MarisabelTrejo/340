const express = require("express");
const router = new express.Router();
const actController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Root account route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(actController.buildAccountManagementView)
);

// LOGIN VIEW
router.get("/login", utilities.handleErrors(actController.buildLogin));

// REGISTRATION VIEW
router.get("/register", utilities.handleErrors(actController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(actController.registerAccount)
);

// Process the login data with validation ✅
router.post(
  "/login",
  regValidate.loginRules(), // Add login validation rules
  regValidate.checkLoginData, // Check login data before processing
  utilities.handleErrors(actController.accountLogin) // Process login
);

router.get("/logout", utilities.handleErrors(actController.accountLogout));

router.get(
  "/editAccount/:account_id",
  utilities.handleErrors(actController.editAccountInfo)
);

router.post("/update", utilities.handleErrors(actController.updateAccount));

router.post(
  "/updatePassword",
  utilities.handleErrors(actController.updatePassword)
);
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(actController.buildAccountManagementView)
);

module.exports = router;
