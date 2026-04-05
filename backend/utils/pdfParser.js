import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number}>} 
 */
export const extractTextFromPDF = async (filePath) => {
    let parser;
    try {
        const dataBuffer = await fs.readFile(filePath);
        parser = new PDFParse({ data: dataBuffer });

        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();

        return {
            text: textResult.text,
            numPages: infoResult.total || 0,
            info: infoResult.info || {},
        }
    } catch (error) {
        console.log("PDF parsing error: ", error);
        throw new Error("Failed to parse PDF file");
    } finally {
        if (parser) {
            await parser.destroy().catch(() => { });
        }
    }
};

export default extractTextFromPDF;