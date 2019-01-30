import { BuilderOptions } from '@pika/types';
export declare function afterJob({ out, reporter }: BuilderOptions): Promise<void>;
export declare function manifest(newManifest: any): any;
export declare function build({ cwd, out, src, reporter }: BuilderOptions): Promise<void>;
