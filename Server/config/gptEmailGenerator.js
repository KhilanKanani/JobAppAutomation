const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 2,
});

const generateJobEmail = async ({ fullName, email, role, companyName, resumeUrl, }) => {
    try {
        const cleanResumeUrl = resumeUrl ? resumeUrl.replace("/upload/", "/upload/f_auto/") : "";
        
        const prompt = `
            You are a senior HR communication expert who writes highly effective job application emails.
        
            Write a **polished, professional, and human-sounding job application email** that makes the HR team feel positive and interested.
        
            Candidate Details:
            - Full Name: ${fullName}
            - Email: ${email}
            - Target Role: ${role || "Relevant Software Engineering Role"}
            - Company Name: ${companyName}
            ${cleanResumeUrl ? `- Resume PDF Link: ${cleanResumeUrl}` : '- Resume: Not provided'}
        
            Important Instructions:
            0. chatGpt can visit resume link and bring data to skill, project, experience and etc and brifly send in email to some bold word. 
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
            11. Resume link send in email to hr can see user resume
            12. make a perfect email and hr can hire this candidate
        
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
            messages: [
                { role: "system", content: "You are an expert HR email writer. Always write naturally and vary tone." },
                { role: "user", content: prompt + `\nVariation Seed: ${Date.now()}` }
            ],
            temperature: 0.6,
            max_tokens: 500,
        });

        // Validate response
        if (!response?.choices?.[0]?.message?.content) {
            throw new Error("Empty response from OpenAI API. Please try again.");
        }

        // Clean up the response
        let emailContent = response.choices[0].message.content.trim();
        
        if (!emailContent || emailContent.length === 0) {
            throw new Error("Generated email content is empty. Please try again.");
        }
        
        // Remove any markdown formatting if present
        emailContent = emailContent
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^#+\s*/gm, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`(.*?)`/g, '$1');

        // Ensure proper HTML structure
        if (!emailContent.includes('<p>') && !emailContent.includes('<div>')) {
            emailContent = emailContent
                .split('\n\n')
                .filter(p => p.trim())
                .map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
                .join('');
        }

        return emailContent;

    } catch (error) {
        console.error("GPT Email Generation Error:", error.message);
        
        // Fallback email template
        const fallbackEmail = `
            <p>Dear Hiring Manager,</p>
            <p>I am writing to express my interest in ${role ? `the ${role} position` : 'a career opportunity'} at ${companyName}.</p>
            <p>With a strong background in software development and a passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.</p>
            <p>My experience includes working with modern technologies and delivering high-quality projects. I am confident that my skills and enthusiasm make me a strong candidate for this role.</p>
            ${resumeUrl ? `<p>I have attached my resume for your review.</p>` : ''}
            <p>Thank you for considering my application. I look forward to hearing from you.</p>
            <p>Best regards,<br/>${fullName}</p>
        `;

        // If it's a retry-able error, rethrow it
        if (error.status === 429 || error.status === 500 || error.status === 503) {
            throw error;
        }

        console.warn("Using fallback email due to error");
        return fallbackEmail.trim();
    }
};

module.exports = generateJobEmail;