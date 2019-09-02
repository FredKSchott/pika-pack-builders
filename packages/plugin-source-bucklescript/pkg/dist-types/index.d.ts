import {BuilderOptions} from '@pika/types';
export declare function validate({cwd}: {cwd: any}): boolean;
export declare function manifest(newManifest: any): any;
export declare function build({cwd, out, reporter}: BuilderOptions): Promise<void>;
