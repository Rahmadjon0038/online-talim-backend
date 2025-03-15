const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const credentials = require("./credentials.json"); // Google API JSON fayli
const SLIDES_TEMPLATE_ID = "14JPDR2SKAWpkLMHC-SF_fdmmAruerXmisJCURPeAjx4"; // Google Slides fayl ID

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
        "https://www.googleapis.com/auth/presentations",
        "https://www.googleapis.com/auth/drive",
    ],
});

async function generateCertificate({ name, surname, fannomi, score }) {
    try {
        const slides = google.slides({ version: "v1", auth });
        const drive = google.drive({ version: "v3", auth });

        // Ballga qarab kategoriya aniqlash
        let category = "Qoniqarli";
        if (score >= 90) category = "A'lo";
        else if (score >= 80) category = "Yaxshi";

        // Google Slides'dan nusxa olish
        const copyRes = await drive.files.copy({
            fileId: SLIDES_TEMPLATE_ID,
            requestBody: { name: `Certificate_${surname}_${name}` },
        });
        const presentationId = copyRes.data.id;

        // Joylarni almashtirish
        await slides.presentations.batchUpdate({
            presentationId,
            requestBody: {
                requests: [
                    { replaceAllText: { containsText: { text: "{name}", matchCase: true }, replaceText: name } },
                    { replaceAllText: { containsText: { text: "{surname}", matchCase: true }, replaceText: surname } },
                    { replaceAllText: { containsText: { text: "{fannomi}", matchCase: true }, replaceText: fannomi } },
                    { replaceAllText: { containsText: { text: "{score}", matchCase: true }, replaceText: `${score}%` } },
                    { replaceAllText: { containsText: { text: "{category}", matchCase: true }, replaceText: category } },
                ],
            },
        });

        // PDF formatga o‘tkazish va yuklash
        const pdfPath = path.join(__dirname, `Certificate_${surname}_${name}.pdf`);
        const pdfRes = await drive.files.export(
            { fileId: presentationId, mimeType: "application/pdf" },
            { responseType: "stream" }
        );

        return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(pdfPath);
            pdfRes.data
                .on("end", () => resolve(pdfPath))
                .on("error", (err) => reject(err))
                .pipe(dest);
        });
    } catch (error) {
        console.error("Error generating certificate:", error);
    }
}

// TEST qilish
generateCertificate({
    name: "Ali",
    surname: "Karimov",
    fannomi: "Matematika",
    score: 85,
}).then((pdfPath) => console.log("Certificate saved at:", pdfPath));
