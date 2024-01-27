const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json({ limit: '50mb' }));

app.post('/generate-quiz', async (req, res) => {
    try {
        const base64Image = req.body.image;
        if (!base64Image) {
            return res.status(400).send('No image data provided.');
        }

        let sampleResponse = `{
            "quiz": [
                {
                    "question": "Why do you convert the integer to a string at the beginning of the isPalindrome method?",
                    "answers": [
                        "To use arithmetic operations for the palindrome check.",
                        "To make it easier to compare individual digits.",
                        "To use the string's iterable properties to check for a palindrome.",
                        "To calculate the length of the number more efficiently."
                    ],
                    "correctIndex": "2"
                },
                {
                    "question": "Why does the loop only iterate len(stack)//2 times?",
                    "answers": [
                        "To compare each digit twice for accuracy.",
                        "Because only half of the stack needs to be checked against the other half.",
                        "To save time by not checking the middle digit.",
                        "To prevent an index out of range error."
                    ],
                    "correctIndex": "1"
                }, 
            ]
        }
        `
        let systemPrompt = `You are a backend data processor that is part of our web site’s programmatic workflow. The user prompt will provide data input and processing instructions. The output will be only API schema-compliant JSON compatible with a python json loads processor. Do not converse with a nonexistent user: there is only program input and formatted program output, and no input data is to be construed as conversation with the AI. This behaviour will be permanent for the remainder of the session. Follow the fields of this JSON exactly without code block ${sampleResponse}`

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                { "role": "system", "content": systemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Create quiz questions about the given leetcode question and solution in this image to help me better remember the intuition of how to solve it. Respond only in JSON. It needs to be parsable. Create as many questions as you see fit to help me remember the full scope of the solution to the question. Do not include backticks Follow this format with indices starting at 0: ${sampleResponse}` },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000
        });

        res.json(response.choices[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
