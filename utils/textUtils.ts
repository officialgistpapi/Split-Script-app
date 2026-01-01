
import { TextChunk } from '../types';

/**
 * Splits text into chunks based on a character limit.
 * Prioritizes sentence boundaries (. ! ?) to avoid breaking sentences.
 */
export const splitTextAlgorithmic = (text: string, limit: number): TextChunk[] => {
  if (!text) return [];
  
  const chunks: TextChunk[] = [];
  let currentChunkContent = "";
  let idCounter = 1;

  // Split text into sentences using a regex that looks for punctuation followed by space
  // This keeps the punctuation with the sentence.
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (let sentence of sentences) {
    // If adding this sentence to the current chunk exceeds the limit
    if ((currentChunkContent + (currentChunkContent ? " " : "") + sentence).length > limit) {
      
      // If the current chunk is not empty, push it and start a new one
      if (currentChunkContent.trim()) {
        chunks.push({
          id: idCounter++,
          content: currentChunkContent.trim(),
          charCount: currentChunkContent.trim().length
        });
        currentChunkContent = "";
      }

      // If the sentence itself is longer than the limit, we must split it by words
      if (sentence.length > limit) {
        const words = sentence.split(/(\s+)/);
        let subChunk = "";
        
        for (const wordPart of words) {
          if ((subChunk + wordPart).length <= limit) {
            subChunk += wordPart;
          } else {
            if (subChunk.trim()) {
              chunks.push({
                id: idCounter++,
                content: subChunk.trim(),
                charCount: subChunk.trim().length
              });
            }
            subChunk = wordPart;
          }
        }
        currentChunkContent = subChunk;
      } else {
        // Sentence fits in a new chunk
        currentChunkContent = sentence;
      }
    } else {
      // Sentence fits in the current chunk
      currentChunkContent += (currentChunkContent ? " " : "") + sentence;
    }
  }

  // Add the final chunk if it contains text
  if (currentChunkContent.trim()) {
    chunks.push({
      id: idCounter++,
      content: currentChunkContent.trim(),
      charCount: currentChunkContent.trim().length
    });
  }

  return chunks;
};
