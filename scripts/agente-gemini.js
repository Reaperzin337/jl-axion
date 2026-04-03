require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ROOT_DIR = path.resolve(__dirname, "..");
const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
const GEMINI_MODEL = String(process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

function printUsage() {
  console.log('Uso: npm run agent:gemini -- "<caminho_do_arquivo>" "<instrucao>"');
  console.log('Exemplo: npm run agent:gemini -- "styles.css" "Melhore o header mobile e simplifique os botões."');
}

function normalizeModelName(modelName) {
  const aliases = new Map([
    ["gemini-3-flash", "gemini-3-flash-preview"],
    ["gemini-3-flash-latest", "gemini-3-flash-preview"],
    ["gemini-2.5-flash-latest", "gemini-2.5-flash"]
  ]);

  return aliases.get(modelName) || modelName;
}

function extractResponseText(response) {
  if (typeof response?.text === "string") {
    return response.text;
  }

  if (typeof response?.text === "function") {
    return response.text();
  }

  if (Array.isArray(response?.candidates)) {
    return response.candidates
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => String(part?.text || "").trim())
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function stripMarkdownFences(text) {
  return String(text || "")
    .replace(/^```[a-z0-9_-]*\s*/gim, "")
    .replace(/```$/gim, "")
    .trim();
}

function buildPrompt(filePath, code, instruction) {
  return [
    `Você é um desenvolvedor sênior trabalhando no projeto e-commerce JL AXION.`,
    `Abaixo está o código atual completo do arquivo ${filePath}:`,
    "",
    code,
    "",
    `Tarefa do usuário: ${instruction}`,
    "",
    "REGRAS ESTRITAS:",
    "1. Retorne APENAS o código final completo e atualizado.",
    "2. NÃO inclua explicações, introduções ou conclusões.",
    "3. NÃO use blocos markdown como ```html, ```js ou ```.",
    "4. Preserve a linguagem, a estrutura e a compatibilidade do arquivo existente.",
    "5. Não invente placeholders nem remova funcionalidades sem necessidade.",
    "6. Se for um arquivo HTML, CSS ou JS, devolva o arquivo inteiro pronto para salvar."
  ].join("\n");
}

async function requestUpdatedCode(filePath, currentCode, instruction) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const model = normalizeModelName(GEMINI_MODEL);
  const prompt = buildPrompt(filePath, currentCode, instruction);

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  const text = stripMarkdownFences(extractResponseText(response));

  if (!text) {
    throw new Error("O Gemini não retornou código para salvar.");
  }

  return text;
}

async function main() {
  const [, , rawFilePath, ...instructionParts] = process.argv;
  const instruction = instructionParts.join(" ").trim();

  if (!rawFilePath || !instruction || rawFilePath === "--help" || rawFilePath === "-h") {
    printUsage();
    process.exit(rawFilePath ? 0 : 1);
  }

  if (!GEMINI_API_KEY) {
    throw new Error("Defina GEMINI_API_KEY no .env ou nas variáveis de ambiente antes de usar o agente.");
  }

  const absoluteFilePath = path.resolve(ROOT_DIR, rawFilePath);

  if (!absoluteFilePath.startsWith(ROOT_DIR)) {
    throw new Error("Por segurança, o arquivo precisa estar dentro da pasta do projeto JL AXION.");
  }

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`Arquivo não encontrado: ${absoluteFilePath}`);
  }

  const currentCode = fs.readFileSync(absoluteFilePath, "utf8");
  const backupPath = `${absoluteFilePath}.bak`;

  console.log(`Lendo: ${absoluteFilePath}`);
  console.log(`Usando modelo: ${normalizeModelName(GEMINI_MODEL)}`);
  console.log("Processando instrução com Gemini...");

  const updatedCode = await requestUpdatedCode(rawFilePath, currentCode, instruction);

  fs.writeFileSync(backupPath, currentCode, "utf8");
  fs.writeFileSync(absoluteFilePath, updatedCode, "utf8");

  console.log(`Arquivo atualizado com sucesso: ${absoluteFilePath}`);
  console.log(`Backup salvo em: ${backupPath}`);
}

main().catch((error) => {
  console.error("Erro ao executar o agente Gemini:");
  console.error(error.message || error);
  process.exit(1);
});
