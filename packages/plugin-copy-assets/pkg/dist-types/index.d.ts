import { BuilderOptions } from '@pika/types';
export declare function manifest(manifest: any): void;
export declare function beforeJob({ cwd, options }: BuilderOptions): Promise<void>;
export declare function build({ out, cwd, reporter, options }: BuilderOptions): Promise<void>;
