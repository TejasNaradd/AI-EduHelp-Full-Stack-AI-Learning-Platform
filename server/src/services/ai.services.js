import OpenAI from "openai";
import ApiError from "../utils/ApiError.js";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const extractTopicsAI = async (text) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an educational content analyzer.",
      },
      {
        role: "user",
        content: `Extract 5 key learning topics from this document. 
Return ONLY a JSON array like ["topic1","topic2"].\n\n${text}`,
      },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  const start = content.indexOf("[");
  const end = content.lastIndexOf("]") + 1;
  const jsonString = content.slice(start, end);

  return JSON.parse(jsonString);
};

export const generateQuizAI = async (text, topics) => {
  const limitedText = text.slice(0, 12000);
  const topicNames = topics.map((t) => t.name);

  const response = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `
You are an AI exam generator.

Generate EXACTLY 10 multiple choice questions.

Rules:
- Use ONLY the provided topics.
- Generate 2 questions per topic.
- Each question must clearly belong to one topic.
- Each question must have exactly 4 options.
- Only one correct answer.
- Return correct answer as index (0–3).
- Do NOT include explanations.
- Return STRICT JSON only.
`,
      },
      {
        role: "user",
        content: `
DOCUMENT:
${limitedText}

TOPICS:
${topicNames.join(", ")}

Return output in this JSON format:

{
  "questions": [
    {
      "question": "string",
      "options": ["option1","option2","option3","option4"],
      "answerIndex": 0,
      "topic": "topic name"
    }
  ]
}
`,
      },
    ],
    temperature: 0.6,
  });

  const content = response.choices[0].message.content;

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}") + 1;

  if (start === -1 || end === -1) {
    throw new Error("Invalid quiz format from AI");
  }

  const parsed = JSON.parse(content.slice(start, end));

  if (!parsed.questions || parsed.questions.length !== 10) {
    throw new Error("Quiz must contain exactly 10 questions");
  }

  const shuffleOptions = (question) => {
    if (!question.options || question.options.length !== 4) {
      throw new Error("Each question must have exactly 4 options");
    }

    const correctAnswer = question.options[question.answerIndex];
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    return {
      ...question,
      options: shuffled,
      answerIndex: shuffled.indexOf(correctAnswer),
    };
  };

  return parsed.questions.map(shuffleOptions);
};

export const generateFlashcardsAI = async (text, topics) => {
  const limitedText = text.slice(0, 12000);
  const topicNames = topics.map((t) => t.name);

  const response = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `
You are an AI study assistant.

Generate flashcards from the document.

Rules:
- Cover ALL provided topics (at least 1 flashcard each)
- For more important topics, generate 2–3 flashcards
- Maximum total flashcards = 8
- Each flashcard must belong to one topic
- Keep questions clear and factual
- Do NOT include explanations outside JSON
- Return STRICT JSON only
`,
      },
      {
        role: "user",
        content: `
DOCUMENT:
${limitedText}

TOPICS:
${topicNames.join(", ")}

Return output in this JSON format:

{
  "flashcards": [
    {
      "question": "string",
      "answer": "string",
      "topic": "topic name"
    }
  ]
}
`,
      },
    ],
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}") + 1;

  if (start === -1 || end === -1) {
    throw new Error("Invalid flashcard format from AI");
  }

  const parsed = JSON.parse(content.slice(start, end));

  if (!parsed.flashcards || parsed.flashcards.length === 0) {
    throw new Error("No flashcards generated");
  }

  return parsed.flashcards.slice(0, 8);
};

export const generateAiResponse = async (text, messages) => {
  try {
    const conversation = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are EduHelp AI — an intelligent study assistant.

Your job is to help students understand study material.

Rules:
- Use the provided study material as the knowledge source.
- Explain concepts clearly in simple language.
- Use bullet points when helpful.
- Give examples if useful.
- If the answer is not in the material, say:
  "This topic is not covered in the provided document."
- Keep answers structured and concise.
`,
        },
        {
          role: "user",
          content: `
STUDY MATERIAL:
${text}

CONVERSATION SO FAR:
${conversation}

Answer the latest user question based on the material above.
`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const reply = response?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new ApiError(500, "No AI response generated");
    }

    return reply;
  } catch (error) {
    console.error("Chat AI Error:", error.message);
    throw new ApiError(500, "Failed to generate chat response");
  }
};

export const generateSummary = async (text) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert educational assistant that creates comprehensive, well-structured study summaries.

Your summaries must follow this EXACT format using clean Markdown:

---

# 📘 [Infer a concise title from the document]
> *One-line description of what this document covers.*

---

## 🧭 Overview
Write 2–3 sentences introducing the topic in simple, student-friendly language.

---

## 🔑 Key Concepts
| Concept | Explanation |
|---------|-------------|
| Term 1  | Clear, concise definition |
| Term 2  | Clear, concise definition |
| Term 3  | Clear, concise definition |

---

## 📌 Important Points
- **Point 1**: Short explanation (1–2 lines max)
- **Point 2**: Short explanation
- **Point 3**: Short explanation
- **Point 4**: Short explanation

---

## 🔍 Deep Dive
> *(Include ONLY if the document contains formulas, algorithms, processes, or step-by-step logic. Otherwise skip this section entirely.)*

\`\`\`
Relevant formula, pseudocode, or process
\`\`\`

- Step 1: Explanation
- Step 2: Explanation

---

## ⚠️ Common Mistakes / Watch Out For
- Mistake or misconception 1
- Mistake or misconception 2
- Mistake or misconception 3

---

## 🧠 Quick Revision Checklist
- [ ] Can you define [key concept 1]?
- [ ] Can you explain [key concept 2]?
- [ ] Can you apply [key concept 3]?

---

## ✅ Conclusion
Write 2–3 sentences summarizing the single most important takeaway from the document.

---

STRICT RULES:
1. Only include sections relevant to the document — skip any section that doesn't apply.
2. Never write long paragraphs — use bullet points and tables wherever possible.
3. Keep all explanations concise (1–2 lines per point).
4. Use simple, student-friendly language — no unnecessary jargon.
5. Infer a meaningful document title from the content if none is provided.
6. The revision checklist must reference actual concepts from the document.
7. "Common Mistakes" must be realistic errors a student could make with this material.`,
      },
      {
        role: "user",
        content: `Summarize the following document:\n\n${text}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
};