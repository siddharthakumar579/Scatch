const { GoogleGenAI } = require("@google/genai") ;
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate's resume and the job description, ranging from 0 to 100"),

   technicalQuestions: z.array(z.object({

        question: z.string().describe("The technical question asked during the interview"),          
        intention: z.string().describe("The intention behind asking the question"),
        answer: z.string().describe("The candidate's answer to the technical question")

    })).describe("Technical questions and answers which may be asked by the interviewer"),

    behavioralQuestions: z.array(z.object({

        question: z.string().describe("The behavioral question asked during the interview"),
        intention: z.string().describe("The intention behind asking the question"),
        answer: z.string().describe("The candidate's answer to the behavioral question")

    })).describe("Behavioral questions and answers which may be asked by the interviewer"),

    skillGaps: z.array(z.object({

        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")

    })).describe("Skill gaps identified in the candidate"),

    preparationPlan: z.array(z.object({

        day: z.number().describe("The day of the preparation plan"),
        focus: z.string().describe("The focus of the preparation plan for that day"),
        tasks: z.array(z.string()).describe("The tasks to be completed on that day")

    })).describe("A day-wise plan for preparing the candidate for the interview"),
    title: z.string().describe("The title of the interview report")
})

const interviewJsonSchema = zodToJsonSchema(interviewReportSchema);
delete interviewJsonSchema.$schema;

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `
    You are an expert technical interviewer. Generate a comprehensive interview report for the candidate.
    IMPORTANT: You must return valid JSON matching the schema. 
    Ensure EVERY object in the lists contains all the keys:
    - For 'technicalQuestions' & 'behavioralQuestions', you MUST include: "question", "intention", and "answer".
    - For 'skillGaps', you MUST include: "skill" and "severity" (where severity is strictly lowercase: "low", "medium", or "high").
    - For 'preparationPlan', you MUST include: "day" (where day is strictly an integer number, e.g. 1, NOT a string like "Day 1"), "focus", and "tasks".
    - You MUST also include the "title" and "matchScore".
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `;

    const interaction = await ai.interactions.create({
        model: "gemini-2.5-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: interviewJsonSchema
        },
    })
   

    const cleanedText = interaction.output_text.replace(/```json\s*|```/g, "").trim();
    const interviewReport = interviewReportSchema.parse(JSON.parse(cleanedText));
    return interviewReport;
}

const generatePdfFromHtml = async (htmlContent) => {

    // Sparticuz Chromium is optimized for cloud/serverless environments
    const browser = await puppeteer.launch({ 
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });
        
        return pdfBuffer;

    } finally {
        // This ALWAYS runs, preventing memory leaks!
        await browser.close();
    }
};

const generateResumePDF = async ({resume, selfDescription, jobDescription}) => {
     const resumePDFSchema = z.object({
        html: z.string().describe("The HTML content of the resume PDF")
    });

    const prompt = `
    You are an expert technical interviewer. Generate a comprehensive resume PDF for the candidate. The resume should be based on the candidate's resume, self-description, and job description which are given as inputs 

    Candidate's Details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    IMPORTANT: 
    -- You must return valid JSON. Do not return arrays of strings. Ensure the output is an object with a single key "html" containing the HTML content of the resume PDF.
    -- The generated HTML must fit EXACTLY on one single A4 page when converted to PDF. 
    -- The resume must be fully ATS-friendly (Applicant Tracking System).
    -- Use tight spacing, avoid large headers and footers.`

    const interaction = await ai.interactions.create({
        model: "gemini-2.5-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: resumePDFSchema
        },
    })
    // const resumePDFResponse = resumePDFSchema.parse(JSON.parse(interaction.output_text));
    const cleanedText = interaction.output_text.replace(/```json\s*|```/g, "").trim();
    const resumePDFResponse = resumePDFSchema.parse(JSON.parse(cleanedText)); 
    const pdfBuffer = await generatePdfFromHtml(resumePDFResponse.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePDF };