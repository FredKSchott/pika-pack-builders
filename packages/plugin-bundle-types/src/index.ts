import { generateDtsBundle } from "dts-bundle-generator";
import path from "path";
import fs from "fs";
import { BuilderOptions } from "@pika/types";

export function manifest(manifest) {
  manifest.types = "dist-types/types.d.ts";
}

export async function build({cwd, out, reporter}: BuilderOptions): Promise<void> {
  const definitionInput = path.join(out, "dist-types/index.d.ts");
  const definitionOutput = path.join(out, "dist-types/types.d.ts");

    if (!fs.existsSync(definitionInput)) {
      console.error(`
⚠️  dist-types/: Attempted to generate a bundle of type definitions, but "dist-types/index.d.ts" file was not found.
                Please ensure that you have "@pika/plugin-build-types" in your pipeline.
`);
      throw new Error(`Failed to build: dist-types/`);
    }

  const definitionBundle = generateDtsBundle([
    {filePath: definitionInput}
  ]);
  fs.writeFileSync(definitionOutput, definitionBundle);

  reporter.created(definitionOutput, 'types');
}
