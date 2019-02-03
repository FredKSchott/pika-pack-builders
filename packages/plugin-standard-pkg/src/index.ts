import path from 'path';
import {BuilderOptions} from '@pika/types';
import {Lint, Build} from 'standard-pkg';

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

export async function build({cwd, out, reporter}: BuilderOptions): Promise<void> {
  const builder = new Build(path.join(cwd, 'src'));
  await builder.init();
  await builder.write(path.join(out, '/dist-src/'));
  reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
}
