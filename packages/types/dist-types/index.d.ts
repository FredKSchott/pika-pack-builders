export declare type BuilderOptions = {
  cwd: string;
  out: string;
  options: any;
  src: {
    loc: string;
    entrypoint: string | string[];
    options: any;
    files: Array<string>;
  };
  watch: string | undefined;
  reporter: {
    info: (msg: string) => void;
    warning: (msg: string) => void;
    success: (msg: string) => void;
    created: (file: string, entrypoint?: string) => void;
  };
  isFull: boolean;
  manifest: any;
  rollup: any;
};
export declare class MessageError extends Error {
  constructor(msg: string);
}
