import path from "path";
import fs from "fs";
import rollupBabel from "rollup-plugin-babel";
import { BuilderOptions, MessageError } from "@pika/types";
import { rollup } from "rollup";

export async function beforeJob({ out }: BuilderOptions) {
  const srcDirectory = path.join(out, "dist-src/");
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError(
      '"dist-src/" does not exist, or was not yet created in the pipeline.'
    );
  }
  const srcEntrypoint = path.join(out, "dist-src/index.js");
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError(
      '"dist-src/index.js" is the expected standard entrypoint, but it does not exist.'
    );
  }
}

export async function loadAllBabelPlugins() {
  const ES2019 = [
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-syntax-optional-catch-binding",
    "@babel/plugin-proposal-optional-catch-binding",
  ];

  const ES2018 = [
    ...ES2019,
    import("@babel/plugin-syntax-async-generators"),
    import("@babel/plugin-proposal-async-generator-functions"),
    import("@babel/plugin-transform-dotall-regex"),
    import("@babel/plugin-transform-named-capturing-groups-regex"),
    import("@babel/plugin-syntax-object-rest-spread"),
    import("@babel/plugin-proposal-object-rest-spread"),
    import("@babel/plugin-proposal-unicode-property-regex"),
  ];

  const ES2017 = [
    ...ES2018,
    import("@babel/plugin-transform-async-to-generator")
  ];

  const ES2016 = [
    ...ES2017,
    import("@babel/plugin-transform-exponentiation-operator")
  ];

  const ES2015 = [
    ...ES2016,
    import("@babel/plugin-transform-arrow-functions"),
    import("@babel/plugin-transform-block-scoped-functions"),
    import("@babel/plugin-transform-block-scoping"),
    import("@babel/plugin-transform-classes"),
    import("@babel/plugin-transform-computed-properties"),
    import("@babel/plugin-transform-destructuring"),
    import("@babel/plugin-transform-duplicate-keys"),
    import("@babel/plugin-transform-for-of"),
    import("@babel/plugin-transform-function-name"),
    import("@babel/plugin-transform-literals"),
    import("@babel/plugin-transform-new-target"),
    import("@babel/plugin-transform-object-super"),
    import("@babel/plugin-transform-parameters"),
    import("@babel/plugin-transform-shorthand-properties"),
    import("@babel/plugin-transform-spread"),
    import("@babel/plugin-transform-sticky-regex"),
    import("@babel/plugin-transform-template-literals"),
    import("@babel/plugin-transform-typeof-symbol"),
    import("@babel/plugin-transform-unicode-regex")
  ];

  return [
    await Promise.all(ES2019),
    await Promise.all(ES2018),
    await Promise.all(ES2017),
    await Promise.all(ES2016),
    await Promise.all(ES2015),
  ];
}

async function buildSingleDist(
  distTag: string,
  distPlugins: any[] | null,
  { out, reporter }: BuilderOptions
): Promise<void> {
  const writeToWeb = path.join(out, distTag, "index.js");

  const result = await rollup({
    input: path.join(out, "dist-src/index.js"),
    plugins: [
      distPlugins && rollupBabel({
        babelrc: false,
        compact: false,
        plugins: distPlugins
      })
    ],
    onwarn: ((warning, defaultOnWarnHandler) => {
      // // Unresolved external imports are expected
      // TODO: rewrite here?
      if (
        warning.code === "UNRESOLVED_IMPORT" &&
        !(warning.source.startsWith("./") || warning.source.startsWith("../"))
      ) {
        return;
      }
      defaultOnWarnHandler(warning);
    }) as any
  });

  await result.write({
    file: writeToWeb,
    format: "esm",
    exports: "named"
  });
  reporter.created(writeToWeb, distTag);
}

export async function build(options: BuilderOptions): Promise<void> {
  const [neededForES2018, neededForES2017, neededForES2016, neededForES2015] = await loadAllBabelPlugins();
  await buildSingleDist('dist-es2019', null, options);
  await buildSingleDist('dist-es2018', neededForES2018, options);
  await buildSingleDist('dist-es2017', neededForES2017, options);
  await buildSingleDist('dist-es2016', neededForES2016, options);
  await buildSingleDist('dist-es2015', neededForES2015, options);
}
