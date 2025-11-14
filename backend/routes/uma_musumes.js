const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllUmaMusumes,
  getUmaMusumeById,
  createUmaMusume,
  updateUmaMusume,
  deleteUmaMusume,
  upload,
} = require("../controllers/uma_musume_controller");

router.get("/", getAllUmaMusumes);
router.get("/:id", getUmaMusumeById);
router.post("/", [auth, upload.single("image")], createUmaMusume);
router.put("/:id", [auth, upload.single("image")], updateUmaMusume);
router.delete("/:id", auth, deleteUmaMusume);

module.exports = router;
