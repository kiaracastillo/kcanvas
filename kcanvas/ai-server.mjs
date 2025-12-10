import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

// my OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// express app setup
const app = express();
const PORT = process.env.AI_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "4mb" }));

// post endpoint to generate sketch images based on a prompt
app.post("/api/sketch", async (req, res) => {

  // try to generate an image using open ai's image generation model
  try {
    const { prompt } = req.body;
    const fullPrompt = `line art, coloring book style, black outlines only, no shading. ${prompt}`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,

    }
  );

  // extract the base64 image data from the response
    const imageBase64 = result.data[0].b64_json;
    return res.json({ imageBase64 });

  } catch (err) {

    console.error("OpenAI error raw:", err);

    
    const apiMsg =
      err?.response?.data?.error?.message ||
      err?.error?.message ||
      err.message ||
      "";

    if (err.status === 403 && apiMsg.includes("must be verified")) {
      return res.status(403).json({
        error: "org_not_verified",
        message:
          "Your OpenAI organization must be verified to use gpt-image-1. Please verify it in the OpenAI dashboard.",
      });
    }

    
    return res
      .status(500)
      .json({ error: "server_error", message: "Failed to generate sketch" });
  }

});


// start the server
app.listen(PORT, () => {
  console.log(`AI server listening on http://localhost:${PORT}`);
});
