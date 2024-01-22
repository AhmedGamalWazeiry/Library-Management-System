const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getBorrowers);
router.post("/", controller.addBorrower);

router.get("/:id", controller.getBorrowerById);
router.put("/:id", controller.putBorrower);
router.patch("/:id", controller.patchBorrower);
router.delete("/:id", controller.deleteBorrower);

module.exports = router;
