import path from 'path';
import { Lint, Build } from 'standard-pkg';
export async function afterJob({ out, reporter }) {
    reporter.info('Linting with standard-pkg...');
    const linter = new Lint(out);
    await linter.init();
    linter.summary();
}
export function manifest(newManifest) {
    newManifest.esnext = newManifest.esnext || 'dist-src/index.js';
    return newManifest;
}
export async function build({ cwd, out, options, reporter }) {
    const builder = new Build(path.join(cwd, 'src'), options);
    await builder.init();
    await builder.write(path.join(out, '/dist-src/'));
    reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
}
