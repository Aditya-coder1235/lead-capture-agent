const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const axios = require("axios");

const qualifyLead = async (lead) => {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: `You are a lead qualification AI for a B2B SaaS company called Oplify Solutions.

A new lead has submitted:
- Name: ${lead.fullName}
- Email: ${lead.email}
- Business: ${lead.businessName}
- Message: ${lead.message}

Tasks:
1. Score as Hot, Warm, or Cold
2. One-line reason (max 15 words)
3. Personalised first-response email draft

Respond in this exact JSON only, no extra text:
{
  "score": "Hot|Warm|Cold",
  "reason": "one line reason",
  "emailDraft": "full email draft"
}`
                }
            ],
            max_tokens: 1000,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    const text = response.data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
};

router.post("/", async (req, res) => {
    try {
        const { fullName, email, businessName, message } = req.body;

        if (!fullName || !email || !businessName || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        const existing = await Lead.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                error: "This email has already submitted a lead.",
                duplicate: true,
            });
        }

        const lead = new Lead({ fullName, email, businessName, message });
        await lead.save();

        try {
            const aiResult = await qualifyLead(lead);
            lead.aiScore = aiResult.score;
            lead.aiReason = aiResult.reason;
            lead.emailDraft = aiResult.emailDraft;
            await lead.save();
        } catch (aiError) {
            console.error("AI scoring failed:", aiError.message);
        }

        res.status(201).json({ message: "Lead captured successfully", lead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;