const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const { isTeacherOrAdmin, verifyToken } = require("../middleware/authMiddleware");

// Testlarni olish
router.get("/:fannomi/:darsnomi", testController.getTests);

// Barcha testlarni o'chirish
router.delete("/:fannomi/:darsnomi", verifyToken, isTeacherOrAdmin, testController.deleteAllTests);

// Bitta testni olish
router.get("/:fannomi/:darsnomi/:testId", testController.getTest);

// Yangi test qo'shish
router.post("/:fannomi/:darsnomi", verifyToken, isTeacherOrAdmin, testController.addTest);

// Bitta testni yangilash
router.put("/:fannomi/:darsnomi/:testId", verifyToken, isTeacherOrAdmin, testController.updateTest);

// Bitta testni o'chirish
router.delete("/:fannomi/:darsnomi/:testId", verifyToken, isTeacherOrAdmin, testController.deleteTest);

// Test natijalarini tekshirish
router.post("/:fannomi/:darsnomi/check-answers", testController.checkQuizAnswers);

router.post("/generate-certificate", testController.generateCertificate)

module.exports = router;
