import {BuilderOptions} from '@pika/types';
export declare function manifest(manifest: any): void;
export declare function beforeBuild({options, cwd}: BuilderOptions): Promise<void>;
export declare function build({cwd, out, options, reporter}: BuilderOptions): Promise<void>;
