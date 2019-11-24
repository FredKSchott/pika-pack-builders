import { BuilderOptions } from '@pika/types';
export declare function beforeBuild({ cwd, options }: BuilderOptions): Promise<void>;
export declare function beforeJob({ out }: BuilderOptions): Promise<void>;
export declare function manifest(manifest: any, { options }: BuilderOptions): void;
export declare function build({ cwd, out, options, reporter, manifest }: BuilderOptions): Promise<void>;
