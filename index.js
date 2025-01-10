import dotenv from "dotenv";
dotenv.config();
import { startUdpServer, createResponse, createTxtAnswer } from "denamed";
import { GoogleGenerativeAI }  from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAea5SZcZq_TKrNmthK0O0o1ej17PV1mY4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Simplified model name for example


startUdpServer(
    async (query) => {
        try {
            const question = query.questions[0];
            console.log("Received query:", query);

            const prompt = `
            Answer the following question in one word or sentence
            Question : ${question.name.split(".").join(" ")}`;

            const result = await model.generateContent(prompt);
            const output = createResponse(query, [createTxtAnswer(question, result.response.text())]);
            console.log("Sending response:", output);

            return output;
        } catch (error) {
            console.error("Error processing query:", error);
        }
    },
    { port: 8001 }
);