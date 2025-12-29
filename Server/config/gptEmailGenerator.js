const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 2,
});

const generateJobEmail = async ({ fullName, email, role, companyName, resumeUrl, }) => {

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not configured");
    }

    const cleanResumeUrl = resumeUrl
        ? resumeUrl.replace("/upload/", "/upload/f_auto/")
        : "";

    const prompt = `
        You are a senior HR communication expert who writes highly effective job application emails.

        Write a polished, professional, and human-sounding job application email.

        Candidate Details:
        - Full Name: ${fullName}
        - Email: ${email}
        - Target Role: ${role || "Relevant Software Engineering Role"}
        - Company Name: ${companyName}
        ${cleanResumeUrl ? `- Resume PDF Link: ${cleanResumeUrl}` : "- Resume: Not provided"}

        Rules:
        - Do NOT invent skills
        - Mention resume naturally
        - Be concise and professional
        - No clichés
        - End with a polite call-to-action

        Output:
        - HTML only
        - Email body only
        - No subject
        - No markdown
    `;

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: "You are an expert HR email writer. Write naturally and vary tone.",
                },
                {
                    role: "user",
                    content: prompt + `\nVariation Seed: ${Date.now()}`,
                },
            ],
            temperature: 0.6,
            max_output_tokens: 500,
        });

        const emailContent = response.output_text?.trim();

        return emailContent;

    }

    catch (error) {
        console.error("GPT EMAIL GENERATION FAILED:", error);
        throw new Error("Failed to generate job application email");
    }
};

module.exports = generateJobEmail;