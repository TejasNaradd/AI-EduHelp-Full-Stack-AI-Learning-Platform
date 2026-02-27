import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateSummary = async (text) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert educational assistant.",
      },
      {
        role: "user",
        content: `Summarize this document clearly:\n\n${text}`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

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

  // ✅ extract JSON safely
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]") + 1;
  const jsonString = content.slice(start, end);

  return JSON.parse(jsonString);
};

export const generateQuizAI = async (text, topics) => {
  const limitedText = text.slice(0, 12000);

  // Extract topic names
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

  // 🔹 Safe JSON extraction
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}") + 1;

  if (start === -1 || end === -1) {
    throw new Error("Invalid quiz format from AI");
  }

  const parsed = JSON.parse(content.slice(start, end));

  if (!parsed.questions || parsed.questions.length !== 10) {
    throw new Error("Quiz must contain exactly 10 questions");
  }

  // 🔥 Shuffle options safely to avoid answer pattern bias
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

  // ✅ Safe JSON extraction (same as quiz)
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}") + 1;

  if (start === -1 || end === -1) {
    throw new Error("Invalid flashcard format from AI");
  }

  const parsed = JSON.parse(content.slice(start, end));

  if (!parsed.flashcards || parsed.flashcards.length === 0) {
    throw new Error("No flashcards generated");
  }

  // ✅ Hard safety max 8
  return parsed.flashcards.slice(0, 8);
};