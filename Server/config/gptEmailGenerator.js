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
        You are a senior HR communication specialist who writes realistic, professional, and human-sounding job application emails.
        
        Write a detailed job application email that a real candidate would send to an HR manager or hiring lead.
        
        Candidate Information:
        Full Name: ${fullName}
        Email: ${email}
        Target Role: ${role || "Entry-Level Software Developer / SDE"}
        Company Name: ${companyName}
        Resume Link: ${cleanResumeUrl}
        
        IMPORTANT CONTEXT:
        - The candidate is a Computer Science student
        - The candidate has prior internship experience
        - The candidate has hands-on experience with full-stack web development
        - The resume link contains complete verified details
        
        CONTENT RULES (MUST FOLLOW EXACTLY):
        - Use 3 to 4 paragraphs only
        - Each paragraph must be wrapped in a single <p> tag
        - There must be ONLY ONE line break between paragraphs (no extra spacing)
        - Introduce the candidate naturally in the first paragraph
        - Briefly mention internship or prior experience in the second paragraph
        - Summarize technical skills and project experience at a high level
        - Do NOT invent company names, achievements, or numbers
        - Phrase experience as “worked on”, “contributed to”, or “hands-on experience”
        - Resume link MUST be included explicitly using an <a> tag
        - Resume link MUST be placed in its own sentence
        - Resume link MUST NOT be omitted under any condition
        - Stricly notice to send resume link in email 
        - End with a polite call-to-action asking for suitable opportunities or guidance
        - Close the email with “Best regards,”
        - The candidate name and email MUST appear immediately after “Best regards,” with NO blank line in between, no spacing in this
        
        STRICT OUTPUT FORMAT (NON-NEGOTIABLE):
        - Output ONLY valid HTML
        - Email BODY only
        - NO subject line
        - NO markdown
        - NO explanations
        - NO comments
        - NO emojis
        - NO extra text outside HTML
        - Use ONLY these HTML tags: <p>, <strong>, <a>
    `;


    try {
        const response = await openai.responses.create({
            model: "gpt-4o-mini",
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