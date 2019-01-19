

export type BuilderOptions = {
  cwd: string,
  out: string,
  options: any,
  src: {
    loc: string,
    entrypoint: string,
    options: any,
    files: Array<string>,
  }
  watch: string | undefined,
  reporter: {
    info: (msg: string) => string;
    warning: (msg: string) => string;
    success: (msg: string) => string;
    created: (file: string, entrypoint?: string) => string;
  },
  isFull: boolean,
  manifest: any, // Manifest
  rollup: any
};
