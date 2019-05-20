import { BuilderOptions } from '@pika/types';
export declare function beforeJob({ out }: BuilderOptions): Promise<void>;
export declare function loadAllBabelPlugins(): Promise<any[][]>;
export declare function build(options: BuilderOptions): Promise<void>;
