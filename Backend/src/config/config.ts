import { config as dotenvConfig } from "dotenv";

dotenvConfig();

type CONFIG = {

  readonly MISTRAL_API_KEY: string;
  readonly COHERE_API_KEY: string;
  readonly GROQ_API_KEY: string;
};

const app_config: CONFIG = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
};

export default app_config;