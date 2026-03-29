import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const outputDir = path.join(root, "mobile-web");

const filesToCopy = [
  "index.html",
  "login.html",
  "cart.html",
  "promotions.html",
  "account.html",
  "favorites.html",
  "product.html",
  "category.html",
  "checkout.html",
  "styles.css",
  "app.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml"
];

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

for (const file of filesToCopy) {
  await fs.copyFile(path.join(root, file), path.join(outputDir, file));
}

await fs.cp(path.join(root, "assets"), path.join(outputDir, "assets"), {
  recursive: true
});

console.log("mobile-web pronto com a loja local da JL AXION.");
