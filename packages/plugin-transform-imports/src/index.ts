import path from 'path';
import {promises as fs} from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';
const ESM_IMPORT = /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](@?[\w-]+[:\/]?[\w-]+)["'\s].*;$/gm;

async function getAllFiles(dir) {
  let dirents;
  try {
    dirents = await fs.readdir(dir, {withFileTypes: true});
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

export async function build({out, options, reporter}: BuilderOptions): Promise<void> {
  const rewriteMap = options.rewrite || {};
  const [allSrcFilePaths, allTypesFilePaths] = await Promise.all([
    getAllFiles(path.join(out, 'dist-src/')),
    getAllFiles(path.join(out, 'dist-types/')),
  ]);

  for (const filePath of [...allSrcFilePaths, ...allTypesFilePaths]) {
    const fileContents = await fs.readFile(filePath, {encoding: 'utf8'});
    const newFileContents = fileContents.replace(ESM_IMPORT, (full, imp, spec) => {
      const rewrittenSpec = rewriteMap[spec];
      if (!rewrittenSpec) {
        throw new MessageError('Unexpected import: ' + spec);
      }
      return `import ${imp} from '${rewrittenSpec}';`;
    });
    await fs.writeFile(filePath, newFileContents, {encoding: 'utf8'});
  }

  reporter.info('rewritten');
}
