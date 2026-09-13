import BlogModel from "../models/Blogmodel.js";
import { generateBlogWithAI } from "../services/aiservices.js";

export const generateBlog = async (req, res) => {
  try {
    const user = req.user
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
   if (blog) {

  await BlogModel.create({
    user:user._id,
    title,
    keywords,
    description,
    content: blog,
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

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find({ user: req.id })
      .select("_id title keywords description content createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Get Blog History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog history",
    });
  }
};