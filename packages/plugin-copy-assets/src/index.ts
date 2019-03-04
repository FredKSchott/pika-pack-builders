import copy from 'copy-concurrently';
import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';

export function manifest(manifest) {}

export async function beforeJob({cwd, options}: BuilderOptions) {
  const files = options.files || ['assets/'];
  for (const fileRel of files) {
    const fileLoc = path.join(cwd, fileRel);
    if (!fs.existsSync(fileLoc)) {
      throw new MessageError(`"${fileRel}" does not exist.`);
    }
  }
}

export async function build({out, cwd, reporter, options}: BuilderOptions): Promise<void> {
  const files = options.files || ['assets/'];
  for (const fileRel of files) {
    const fileLoc = path.join(cwd, fileRel);
    const writeToLoc = path.join(out, fileRel);
    reporter.info(`copying ${fileRel}...`);
    await copy(fileLoc, writeToLoc);
  }

}
