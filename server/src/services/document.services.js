import axios from "axios";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { Document } from "../models/document.model.js";
import ApiError from "../utils/ApiError.js";

const processDocument = async (docId) => {
  try {
    const document = await Document.findById(docId);
    if (!document) return;

    document.status = "processing";
    await document.save();

    const response = await axios.get(document.file_url, {
      responseType: "arraybuffer"
    });

    // ✅ convert Buffer → Uint8Array
    const pdf = await getDocument({
      data: new Uint8Array(response.data)
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    document.text = text;
    document.pages = pdf.numPages;
    document.status = "text_extracted";

    await document.save();


  } catch (error) {
    await Document.findByIdAndUpdate(docId, { status: "failed" });
    throw new ApiError(500, "Error processing document");
  }
};

const generateSummaryService = async (docId) => {
  const document = await Document.findById(docId);

  if (!document) {
    throw new Error("Document not found");
  }

  if (!document.text) {
    throw new Error("Text not extracted yet");
  }

  // 🔥 Basic summary logic (temporary)
  const summary = document.text.substring(0, 2000);

  // 🔥 Basic topic extraction logic
  const topics = extractBasicTopics(document.text);

  document.summary = summary;

  document.topics = topics.map(topic => ({
    name: topic,
    masteryLevel: 0,
  }));

  await document.save();

  return document;
};

// Simple topic extraction
const extractBasicTopics = (text) => {
  const words = text
    .split(/\s+/)
    .filter(word => word.length > 6);

  const unique = [...new Set(words)];

  return unique.slice(0, 5);
};

export {
    processDocument,
    generateSummaryService
}