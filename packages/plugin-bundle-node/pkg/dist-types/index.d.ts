import { BuilderOptions } from '@pika/types';
export declare function beforeJob({ out }: BuilderOptions): Promise<void>;
export declare function build({ out, isFull, reporter }: BuilderOptions): Promise<void>;
