/**
 * One-time script to reprocess all documents stuck in 'failed' or 'processing' status.
 * Run: node scripts/reprocessDocuments.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Document from '../models/Document.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';

dotenv.config();

const reprocessDocuments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all documents with 'failed' or 'processing' status
        const docs = await Document.find({ status: { $in: ['failed', 'processing'] } });
        console.log(`Found ${docs.length} document(s) to reprocess`);

        for (const doc of docs) {
            console.log(`\nReprocessing: "${doc.title}" (${doc._id})`);
            console.log(`  Current status: ${doc.status}`);

            // Extract filename from filePath URL
            const filename = doc.filePath.split('/').pop();
            const localPath = path.join(process.cwd(), 'uploads', 'documents', filename);

            try {
                console.log(`  Reading file: ${localPath}`);
                const { text, numPages } = await extractTextFromPDF(localPath);

                if (!text || text.trim().length < 10) {
                    console.log(`  WARNING: Extracted text is very short (${text?.length || 0} chars)`);
                    console.log(`  This PDF might be a scanned image document.`);
                    // Still mark as ready but with minimal text
                }

                const chunks = chunkText(text, 500, 50);
                console.log(`  Extracted ${text.length} chars, ${chunks.length} chunks`);

                await Document.findByIdAndUpdate(doc._id, {
                    extractedText: text,
                    chunks: chunks,
                    status: 'ready'
                });

                console.log(`  ✅ Successfully reprocessed -> status: ready`);
            } catch (err) {
                console.error(`  ❌ Failed to reprocess: ${err.message}`);
                await Document.findByIdAndUpdate(doc._id, { status: 'failed' });
            }
        }

        console.log('\nDone!');
        process.exit(0);
    } catch (error) {
        console.error('Script error:', error);
        process.exit(1);
    }
};

reprocessDocuments();
