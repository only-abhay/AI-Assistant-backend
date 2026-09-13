import BlogModel from "../models/Blogmodel.js";
import { generateBlogWithAI } from "../services/aiservices.js";
import PassModel from "../models/PassModel.js"


export const generateBlog = async (req, res) => {
  try {
    const user = req.user;
    const { title, keywords, description } = req.body;

       // VALIDATION

    if (!title || !keywords || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, keywords and description are required",
      });
    }

     // GET USER PASS

    const pass = await PassModel.findOne({
      userId: user._id,
    });

    if (!pass) {
      return res.status(400).json({
        success: false,
        message: "Please select a plan first.",
      });
    }

        // DAILY RESET

    const today = new Date();
    const lastReset = new Date(pass.lastResetDate);

    const isNewDay =
      today.getFullYear() !== lastReset.getFullYear() ||
      today.getMonth() !== lastReset.getMonth() ||
      today.getDate() !== lastReset.getDate();

    if (isNewDay) {
      pass.blogCount = 0;
      pass.lastResetDate = today;

      await pass.save();
    }

    // FREE PLAN LIMIT
  
    if (pass.plan === 0 && pass.blogCount >= 10) {
      return res.status(403).json({
        success: false,
        message: "You have reached your daily limit of 10 blogs.",
        blogCount: pass.blogCount,
        limit: 10,
      });
    }

   
    // GENERATE BLOG WITH AI
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

  
    // SAVE BLOG
    
    await BlogModel.create({
      user: user._id,
      title,
      keywords,
      description,
      content: blog,
    });


    // INCREASE BLOG COUNT
    if (pass.plan === 1) {
      pass.blogCount += 1;
      await pass.save();
    }

  
    // RESPONSE
  
    return res.status(200).json({
      success: true,
      message: "Blog generated successfully",
      blog,
      blogCount: pass.plan === 1 ? pass.blogCount : null,
      limit: pass.plan === 1 ? 10 : "unlimited",
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