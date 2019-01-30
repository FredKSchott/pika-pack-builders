import { BuilderOptions } from '@pika/types';
export declare function beforeBuild({ options }: BuilderOptions): Promise<void>;
export declare function beforeJob({ out }: BuilderOptions): Promise<void>;
export declare function manifest(manifest: any): void;
export declare function build({ out, reporter, options }: BuilderOptions): Promise<void>;
