import fs from "node:fs";
import esbuild from "esbuild";

const outDir = "dist";
const staticDir = "static";
const watch = process.argv.includes("--watch");
const port = 3000;

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);
fs.readdirSync(staticDir).forEach((path) => {
  fs.cpSync(`${staticDir}/${path}`, outDir);
});

const options = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  platform: "browser" as const,
  outdir: outDir,
  splitting: true,
  format: "esm" as const,
  minify: true,
  metafile: true as const,
};

if (watch) {
  const ctx = await esbuild.context(options);
  ctx.watch();
  ctx.serve({ port, servedir: outDir });
  console.log(`Serving at http://localhost:${port}`);
} else {
  const result = await esbuild.build(options);
  console.log(esbuild.analyzeMetafileSync(result.metafile, { color: true }));
}
