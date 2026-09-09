import "dotenv/config";

export async function SendOtpMail(normalizedEmail, otp) {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY is missing");
      return false;
    }
    if (!normalizedEmail || !otp) {
      console.error("Email or OTP is missing");
      return false;
    }

    console.log("Sending OTP to:", normalizedEmail);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "AI Workspace",
          email: process.env.EMAIL_KEY, // must be the email you verified/added as a sender in Brevo
        },
        to: [{ email: normalizedEmail }],
        subject: "AI Workspace - Verify Your Email",
        htmlContent: `
          <div style="margin:0;padding:32px 16px;background:#f5f7fb;font-family:Arial,sans-serif;color:#0f172a;">
            <div style="max-width:520px;margin:0 auto;padding:32px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;">
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;padding:10px 16px;background:#eef2ff;border-radius:10px;color:#4f46e5;font-size:20px;font-weight:700;">
                  AI<span style="color:#6366f1;">Workspace</span>
                </div>
              </div>
              <h1 style="margin:0;text-align:center;font-size:24px;">Verify your email</h1>
              <p style="margin:20px 0 0;line-height:1.6;color:#475569;">Hello,</p>
              <p style="margin:8px 0 0;line-height:1.6;color:#475569;">Use the verification code below to finish setting up your AI Workspace account.</p>
              <div style="margin:28px 0;padding:18px;text-align:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;">${otp}</span>
              </div>
              <p style="margin:0;line-height:1.6;color:#475569;">This code will expire in <strong>10 minutes</strong>.</p>
              <p style="margin:8px 0 0;line-height:1.6;color:#475569;">If you did not request this code, you can safely ignore this email.</p>
              <p style="margin:28px 0 0;line-height:1.6;color:#475569;">Thanks,<br/><strong>The AI Workspace Team</strong></p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo Error:", data);
      return false;
    }

    console.log("OTP email sent successfully:", data.messageId);
    return true;
  } catch (error) {
    console.error("Email Error:", {
      message: error.message,
    });
    return false;
  }
}