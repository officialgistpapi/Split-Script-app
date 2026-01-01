
export interface TextChunk {
  id: number;
  content: string;
  charCount: number;
}

export interface SplitOptions {
  limit: number;
  smartSplit: boolean;
}
