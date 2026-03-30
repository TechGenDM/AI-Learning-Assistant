import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number}>} 
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        // pdf-parse expects a Unit8Array, not a Buffer
        const parser = await PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();
        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        }
    } catch (error) {
        console.log("PDF parsing error: ", error);
        throw new Error("Failed to parse PDF file");
    }
};