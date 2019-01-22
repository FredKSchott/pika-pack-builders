import { BuilderOptions } from '@pika/types';
export declare function manifest(manifest: any, { cwd }: BuilderOptions): Promise<void>;
export declare function build({ cwd, out, src }: BuilderOptions): Promise<void>;
