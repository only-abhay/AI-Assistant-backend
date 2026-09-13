
import ai from "../services/gemini.js";
import ResumeQuestionModel from "../models/resumeModel.js";

 const CreateQandA = async (req, res) => {
  try {
    const user = req.user
    let resume = req.files?.resume;

    if (Array.isArray(resume)) {
      resume = resume[0];
    }

    const { jobDescription } = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    if (resume.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    if (resume.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume must be less than 10 MB",
      });
    }

  const prompt = `
You are a good technical interview teacher.

Based on the uploaded resume and the given job description,
generate exactly 20 interview questions for the candidate.

Questions should be based on:
- Candidate's skills
- Candidate's projects
- Candidate's experience
- Technologies mentioned in the resume
- Requirements mentioned in the job description

For every question, also provide:
- id: unique number from 1 to 20
- question: the interview question
- answer: a short, clear and technically correct expected answer
- priority: "High", "Medium", or "Low"

Mix technical, project-based, experience-based and job-specific questions.

Do not invent anything that is not present in the resume or job description.
The answer should only explain what a good candidate should answer based on the resume and job description.

Return exactly this JSON format and nothing else:

{
  "questions": [
    {
      "id": 1,
      "question": "",
      "answer": "",
      "priority": "High"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: resume.mimetype,
            data: resume.data.toString("base64"),
          },
        },
        {
          text: `
Job Description:

${jobDescription}

${prompt}
`,
        },
      ],
    });

    let aiText = response.text?.trim();

    if (!aiText) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response",
      });
    }

    aiText = aiText
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let result;

    try {
      result = JSON.parse(aiText);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        rawResponse: aiText,
      });
    }
const savedData = await ResumeQuestionModel.create({
  user: user._id,
  jobDescription,
  questions: result.questions,
});
    return res.status(200).json({
      success: true,
      message: "Interview questions generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Resume Q&A Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions server facing to much requests",
      error: error.message,
    });
  }
};

export default CreateQandA

export const getMyQuestions = async (req, res) => {
  try {
    const records = await ResumeQuestionModel.find({ user: req.id })
      .select("_id resume jobDescription questions createdAt")
      .sort({ createdAt: -1 });
    const data = records.map((record) => ({
      ...record.toObject(),
      resume: record.resume || { fileName: null, mimeType: null },
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Resume History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume interview history",
    });
  }
};