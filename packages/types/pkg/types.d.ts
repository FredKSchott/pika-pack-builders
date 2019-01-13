

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
  reporter: any, // Reporter
  isFull: boolean,
  manifest: any, // Manifest
  rollup: any
};
