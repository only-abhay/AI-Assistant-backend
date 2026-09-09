import { generateBlogWithAI } from "../services/aiservices.js";

export const generateBlog = async (req, res) => {
  try {
    const { title, keywords, description } = req.body;

    // Validation
    if (!title || !keywords || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, keywords and description are required",
      });
    }

    const blog = await generateBlogWithAI({
      title,
      keywords,
      description,
    });

    if (!blog) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate blog",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog generated successfully",
      blog,
    });
  } catch (error) {
    console.error("Generate Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the blog",
    });
  }
};