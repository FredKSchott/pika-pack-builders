import { BuilderOptions } from '@pika/types';
export declare function manifest(manifest: any, { options }: BuilderOptions): void;
export declare function beforeJob({ out }: BuilderOptions): Promise<void>;
export declare function build({ out, reporter, options }: BuilderOptions): Promise<void>;
