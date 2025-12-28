const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 2,
});

const generateJobEmail = async ({ fullName, email, role, companyName, resumeUrl, }) => {
    const prompt = `
        You are a senior HR communication expert who writes highly effective job application emails.

        Write a **polished, professional, and human-sounding job application email** that makes the HR team feel positive and interested.

        Candidate Details:
        - Full Name: ${fullName}
        - Email: ${email}
        - Target Role: ${role || "Relevant Software Engineering Role"}
        - Company Name: ${companyName}
        - Resume PDF Link: ${resumeUrl.replace("/upload/", "/upload/f_auto/")}

        Important Instructions:
        1. Assume the resume PDF contains the candidate’s real skills, experience, and projects.
        2. Briefly summarize the candidate’s strongest skills and experience **without inventing anything**.
        3. Naturally mention that the **resume PDF is attached or available via link**.
        4. Align the candidate’s profile with the role and company.
        5. Keep the email:
           - Clear
           - Concise
           - Professional
           - Confident but respectful
        6. Avoid clichés like “I hope this email finds you well”.
        7. Do NOT add unnecessary information.
        8. Do NOT add extra blank lines or spacing.
        9. End with a polite call-to-action (e.g., interview or discussion).
        10. Each email must sound slightly different every time.

        Tone:
        Professional, respectful, genuine, and recruiter-friendly.

        Output Rules (VERY IMPORTANT):
        - Return ONLY the email body
        - Format strictly in clean HTML
        - No subject line
        - No markdown
        - No explanations
        - No comments
    `;


    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        // messages: [
        //     { role: "system", content: "You are an expert HR email writer." },
        //     { role: "user", content: prompt },
        // ],
        messages: [
            { role: "system", content: "You are an expert HR email writer. Always write naturally and vary tone." },
            { role: "user", content: prompt + `\nVariation Seed: ${Date.now()}` }
        ],
        temperature: 0.6,
    });

    return response.choices[0].message.content;
};

module.exports = generateJobEmail;