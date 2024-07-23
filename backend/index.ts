import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { LLM } from 'llama-node';
import { LLamaCpp } from 'llama-node/dist/llm/llama-cpp.js';
import { readFile, writeFile } from 'node:fs/promises';
import pdfParse from 'pdf-parse';
import fileUpload from 'express-fileupload';
import path from 'path';
import type { CompletionCallback } from 'llama-node/dist/llm/type';

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const model = new LLM(LLamaCpp);
let isModelLoaded = false;

async function loadModel() {
  try {
    await model.load({
      modelPath: './models/llama-2-7b-chat.Q3_K_S.gguf',
      enableLogging: true,
      nCtx: 2048,  // You might want to increase this for the Llama 2 model
      seed: 0,
      f16Kv: false,
      logitsAll: false,
      vocabOnly: false,
      useMlock: false,
      embedding: false,
      useMmap: true,
      nGpuLayers: 0
    });
    isModelLoaded = true;
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

loadModel();

app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  
  if (!isModelLoaded) {
    return res.status(503).json({ error: 'Model not loaded yet. Please try again later.' });
  }
  
  try {
    let response = '';
    const callback: CompletionCallback = (data: { token: string; completed: boolean }) => {
      response += data.token;
    };

    await model.createCompletion(
      {
        prompt: message,
        nThreads: 4,
        nTokPredict: 2048,
        topK: 40,
        topP: 0.9,
        temp: 0.8,
        repeatPenalty: 1.1
      },
      callback
    );
    
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/upload-pdf', async (req: Request, res: Response) => {
  if (!req.files || !('pdf' in req.files)) {
    return res.status(400).send('No PDF file uploaded');
  }

  const pdfFile = req.files.pdf as fileUpload.UploadedFile;
  const filePath = path.join(process.cwd(), 'pdfs', pdfFile.name);

  try {
    // Convert the file data to a Uint8Array
    const fileData = new Uint8Array(pdfFile.data);
    
    // Write the file
    await writeFile(filePath, fileData);
    
    // Read and parse the PDF
    const dataBuffer = await readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Here you would typically process and store the text for use in your chatbot
    res.send('PDF uploaded and processed successfully');
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Error processing PDF');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));