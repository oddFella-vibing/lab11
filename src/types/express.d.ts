import "express";
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT?: string;
    MONGO_URI?: string;
    JWT_SECRET?: string;
  }
}

declare var process: NodeJS.Process;
