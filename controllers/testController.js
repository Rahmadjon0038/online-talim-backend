const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Lesson = require("../models/Lessons");
const {generateSer} = require("./sertificateGenerate");

// Utility function for reusable logic
const findLessonAndTopic = async (fannomi, darsnomi) => {
  const lesson = await Lesson.findOne({ nomi: fannomi, "topics.name": darsnomi });
  if (!lesson) throw new Error("Dars topilmadi");

  const topic = lesson.topics.find((t) => t.name === darsnomi);
  if (!topic) throw new Error("Darsda tegishli mavzu topilmadi");

  return { lesson, topic };
};

// 1. Yangi test qo'shish
const addTest = async (req, res) => {
  try {
    const { fannomi, darsnomi } = req.params;
    const { title, options, correctOption } = req.body;

    if (!title || !options || !correctOption) {
      return res.status(400).json({ message: "To'liq ma'lumot yuborilmadi." });
    }

    const newQuiz = {
      title,
      variant: options.map((option) => ({
        name: option.name,
        correct: option.id.toString() === correctOption.toString(),
      })),
    };

    const { lesson, topic } = await findLessonAndTopic(fannomi, darsnomi);

    topic.test.push(newQuiz);
    await lesson.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("addTest error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 2. Barcha testlarni olish
const getTests = async (req, res) => {
  try {
    const { fannomi, darsnomi } = req.params;
    const { topic } = await findLessonAndTopic(fannomi, darsnomi);

    if (!topic.test || topic.test.length === 0) {
      return res.status(404).json({ message: "Testlar topilmadi" });
    }

    const userRole = req.user?.role || "user";
    const isAdmin = userRole === "admin";

    const tests = topic.test.map((v) => ({
      title: v.title,
      id: v._id,
      fan: fannomi,
      dars: darsnomi,
      variant: v.variant.map((v2) => ({
        name: v2.name,
        id: v2._id,
        correct: isAdmin ? v2.correct : undefined,
      })),
      correctOption: isAdmin ? v.variant.find((v2) => v2.correct)?._id : undefined,
    }));

    res.json(tests);
  } catch (error) {
    console.error("getTests error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 3. Barcha testlarni o'chirish
const deleteAllTests = async (req, res) => {
  try {
    const { fannomi, darsnomi } = req.params;
    const { lesson, topic } = await findLessonAndTopic(fannomi, darsnomi);

    topic.test = [];
    await lesson.save();

    res.json({ message: "Barcha testlar muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("deleteAllTests error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 4. Bitta testni yangilash
const updateTest = async (req, res) => {
  try {
    const { fannomi, darsnomi, testId } = req.params;
    const { title, options, correctOption } = req.body;

    if (!title || !options || !correctOption) {
      return res.status(400).json({ message: "To'liq ma'lumot yuborilmadi." });
    }

    const { lesson, topic } = await findLessonAndTopic(fannomi, darsnomi);

    const test = topic.test.find((t) => t._id.toString() === testId);
    if (!test) return res.status(404).json({ message: "Test topilmadi" });

    test.title = title;
    test.variant = options.map((option) => ({
      name: option.name,
      correct: option.id.toString() === correctOption.toString(),
    }));

    await lesson.save();

    res.json(test);
  } catch (error) {
    console.error("updateTest error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 5. Bitta testni o'chirish
const deleteTest = async (req, res) => {
  try {
    const { fannomi, darsnomi, testId } = req.params;
    const { lesson, topic } = await findLessonAndTopic(fannomi, darsnomi);

    topic.test = topic.test.filter((t) => t._id.toString() !== testId);
    await lesson.save();

    res.json({ message: "Test muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("deleteTest error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 6. Bitta testni olish
const getTest = async (req, res) => {
  try {
    const { fannomi, darsnomi, testId } = req.params;
    const { topic } = await findLessonAndTopic(fannomi, darsnomi);

    const test = topic.test.find((t) => t._id.toString() === testId);
    if (!test) return res.status(404).json({ message: "Test topilmadi" });

    res.json(test);
  } catch (error) {
    console.error("getTest error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 7. Test natijalarini tekshirish
const checkQuizAnswers = async (req, res) => {
  try {
    const { fannomi, darsnomi } = req.params;
    const { answers } = req.body;
    console.log(answers)
    const { topic } = await findLessonAndTopic(fannomi, darsnomi);

    if (!topic.test || topic.test.length === 0) {
      return res.status(404).json({ message: "Testlar topilmadi" });
    }

    let correctAnswersCount = 0;

    topic.test.forEach((quiz) => {
      const userAnswer = answers[quiz._id];
      const correctOption = quiz.variant.find((v) => v.correct)?.id.toString();

      if (userAnswer && userAnswer === correctOption) {
        correctAnswersCount++;
      }
    });

    res.status(200).json({
          success: true,
          correctAnswers: correctAnswersCount,

        }
    );

  } catch (error) {
    console.error("checkQuizAnswers error:", error);
    res.status(500).json({ message: "Javoblarni tekshirishda server xatosi yuz berdi" });
  }

};

// Sertifikat yaratish funksiyasi


const generateCertificate = async (req, res) => {
  try {
    const {isFinish,  name, surname, fannomi, score } = req.body;
    // const {  name, surname, fannomi, score } = {name: "Hojiakbar",surname: "Hojiakbar",fannomi: "Hojiakbar", score: 70};

    if (!isFinish || score < 70) {
      return res.status(400).json({ message: "Sertifikat berish shartlari bajarilmadi." });
    }

    const pdfPath = await generateSer({ name, surname, fannomi, score });

    if (pdfPath) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=Certificate_${surname}_${name}.pdf`);

      const readStream = fs.createReadStream(pdfPath);
      readStream.pipe(res);

      readStream.on("end", () => {
        // Faylni o‘chirish (agar vaqtincha saqlangan bo‘lsa)
        fs.unlink(pdfPath, (err) => {
          if (err) console.error("File delete error:", err);
        });
      });
    } else {
      res.status(500).json({ message: "Sertifikat generatsiya qilishda xatolik yuz berdi." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi." });
  }
};




module.exports = {
  addTest,
  getTests,
  deleteAllTests,
  updateTest,
  deleteTest,
  getTest,
  checkQuizAnswers,
  generateCertificate, // Yangi funksiya qo‘shildi
};
