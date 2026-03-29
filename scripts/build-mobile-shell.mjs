import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const outputDir = path.join(root, "mobile-web");
const assetsDir = path.join(outputDir, "assets");

const shellHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JL AXION</title>
  <meta name="theme-color" content="#58c2ff">
  <style>
    :root {
      color-scheme: dark;
      --bg: #09111a;
      --surface: rgba(17, 28, 40, 0.92);
      --border: rgba(116, 196, 255, 0.18);
      --text: #f6fbff;
      --muted: #aebccc;
      --primary: #68c4ff;
      --secondary: #ff9d67;
      --shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 28px;
      font-family: "Bahnschrift", "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(74, 170, 255, 0.26), transparent 30%),
        radial-gradient(circle at top right, rgba(255, 157, 103, 0.12), transparent 24%),
        linear-gradient(180deg, #09111a, #111c28);
    }

    .shell {
      width: min(100%, 420px);
      padding: 26px;
      border-radius: 28px;
      border: 1px solid var(--border);
      background:
        linear-gradient(150deg, rgba(74, 170, 255, 0.14), rgba(255, 157, 103, 0.05)),
        var(--surface);
      box-shadow: var(--shadow);
      text-align: center;
    }

    img {
      width: 174px;
      margin: 0 auto 18px;
      display: block;
    }

    h1 {
      margin: 0 0 10px;
      font-size: 1.8rem;
      line-height: 1.05;
    }

    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
    }

    .bar {
      width: 100%;
      height: 10px;
      margin-top: 22px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.06);
    }

    .bar::after {
      content: "";
      display: block;
      width: 40%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      animation: loading 1.3s ease-in-out infinite;
    }

    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(260%); }
    }
  </style>
</head>
<body>
  <main class="shell">
    <img src="./assets/jl-axion-lockup.svg" alt="JL AXION">
    <h1>Carregando a loja JL AXION</h1>
    <p>O app foi preparado para abrir a versao oficial da loja assim que a conexao estiver pronta.</p>
    <div class="bar" aria-hidden="true"></div>
  </main>
</body>
</html>
`;

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(assetsDir, { recursive: true });

await fs.writeFile(path.join(outputDir, "index.html"), shellHtml, "utf8");
await fs.copyFile(path.join(root, "assets", "jl-axion-lockup.svg"), path.join(assetsDir, "jl-axion-lockup.svg"));
await fs.copyFile(path.join(root, "favicon.svg"), path.join(outputDir, "favicon.svg"));

console.log("mobile-web pronto para o Capacitor.");
