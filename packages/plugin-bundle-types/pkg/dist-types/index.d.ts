import { BuilderOptions } from "@pika/types";
export declare function manifest(manifest: any): void;
export declare function build({ cwd, out, reporter }: BuilderOptions): Promise<void>;
