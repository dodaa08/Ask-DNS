import dotenv from "dotenv";
import fetch, { Headers } from "node-fetch";
globalThis.fetch = fetch;
globalThis.Headers = Headers;

dotenv.config();

import { startUdpServer, createResponse, createTxtAnswer } from "denamed";
import { GoogleGenerativeAI } from "@google/generative-ai";

const port = process.env.PORT || 8000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCljO9ISLQqqMIj_DZ4pnM_AvNQp68zPHY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

startUdpServer(
    async (query) => {
        try {
            const question = query.questions[0];

            const prompt = `
            Answer the following question in one word or sentence
            Question: ${question.name.split(".").join(" ")}`;
            console.log("Question:", question.name);

            const result = await model.generateContent(prompt);
            const output = createResponse(query, [createTxtAnswer(question, result.response.text())]);
            console.log("Sending response:", output.answers[0].data.target);

            return output;
        } catch (error) {
            console.error("Error processing query:", error);
        }
    },
    { port: 8001 }
);
