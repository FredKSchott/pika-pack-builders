import path from "path";
import fs from "fs";
import asc from "assemblyscript/cli/asc";
export function validate({
  cwd
}) {
  return fs.existsSync(path.join(cwd, "src/index.ts"));
}
export function manifest(newManifest) {
  return newManifest;
}
export async function build({
  out,
  cwd,
  options,
  reporter
}) {
  const relativeOutWasm = path.relative(cwd, path.join(out, "assets/index.wasm"));
  const relativeOutTypes = path.relative(cwd, path.join(out, "assets/index.d.ts"));
  await new Promise((resolve, reject) => {
    asc.main(["src/index.ts", "--binaryFile", relativeOutWasm, "-d", relativeOutTypes, "--optimize", "--sourceMap", // Optional:
    "--use", " Math=JSMath", "-O3", "--importMemory", ...(options.args || [])], {
      stdout: reporter.stdout,
      stderr: reporter.stderr
    }, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
  reporter.created(path.join(out, "assets/index.wasm"));
}