declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        status: string;
        tokenVersion: number;
      };
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      };
    }
  }
}

export {};