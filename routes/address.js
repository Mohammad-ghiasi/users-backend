const express = require("express");

const { newaddress, alladdress, deleteAddress, editaddress} = require("../controllers/addressController");
const router = express.Router();

router.get("/alladdress", alladdress);
router.post("/newaddress", newaddress);
router.put("/editaddress", editaddress);
router.delete("/deleteaddress/:addressId", deleteAddress);

module.exports = router;
