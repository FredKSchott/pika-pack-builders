import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';
import {Lint, Build} from 'standard-pkg';

export async function beforeJob({cwd}: BuilderOptions) {
  const srcDirectory = path.join(cwd, "src/");
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError('@pika/pack expects a standard package format, where package source must live in "src/".');
  }
  if (!fs.existsSync(path.join(cwd, "src/index.js"))
    && !fs.existsSync(path.join(cwd, "src/index.ts"))
    && !fs.existsSync(path.join(cwd, "src/index.jsx"))
    && !fs.existsSync(path.join(cwd, "src/index.tsx"))
  ) {
    throw new MessageError('@pika/pack expects a standard package format, where the package entrypoint must live at "src/index".');
  }
}

export async function afterJob({out, reporter}: BuilderOptions) {
  reporter.info('Linting with standard-pkg...');
  const linter = new Lint(out);
  await linter.init();
  linter.summary();
}

export function manifest(newManifest) {
  newManifest.esnext = newManifest.esnext || 'dist-src/index.js';
  return newManifest;
}

export async function build({cwd, out, options, reporter}: BuilderOptions): Promise<void> {
  const builder = new Build(path.join(cwd, 'src'), options);
  await builder.init();
  await builder.write(path.join(out, '/dist-src/'));
  reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
}
