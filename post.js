const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Agar ishlatilmasa: `npm install node-fetch`

const downloadCertificate = async ({ isFinish, name, surname, score, fannomi }) => {
  if (!isFinish || score < 60) {
    console.log("Siz sertifikat olish uchun yetarli ball to‘play olmadingiz.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/test/generate-certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFinish, name, surname, score, fannomi }),
    });

    if (!response.ok) {
      throw new Error("Sertifikat yaratishda xatolik yuz berdi.");
    }

    // Faylni oqim sifatida olish
    const filePath = path.join(__dirname, `certificate_${surname}_${name}.pdf`);
    const fileStream = fs.createWriteStream(filePath);

    response.body.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log(`✅ Sertifikat muvaffaqiyatli yuklandi: ${filePath}`);
    });

  } catch (error) {
    console.error("❌ Xatolik:", error);
  }
};

// Sertifikat yuklab olish uchun chaqirish
downloadCertificate({
  isFinish: true,
  name: "Ali",
  surname: "Valiyev",
  score: 85,
  fannomi: "Matematika",
});
