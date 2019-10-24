import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import {BuilderOptions, MessageError} from '@pika/types';
import {Extractor, ExtractorConfig, ExtractorResult, IConfigFile} from '@microsoft/api-extractor';
const DEFAULT_ENTRYPOINT = 'types';

/**
 * Config file for API Extractor.  For more info, please visit: https://api-extractor.com
 */
function getConfigData(cwd: string, out: string, tsConfigPath: string) {
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',

    /**
     * Optionally specifies another JSON config file that this file extends from.  This provides a way for
     * standard settings to be shared across multiple projects.
     *
     * If the path starts with "./" or "../", the path is resolved relative to the folder of the file that contains
     * the "extends" field.  Otherwise, the first path segment is interpreted as an NPM package name, and will be
     * resolved using NodeJS require().
     *
     * SUPPORTED TOKENS: none
     * DEFAULT VALUE: ""
     */
    // "extends": "./shared/api-extractor-base.json"
    // "extends": "my-package/include/api-extractor-base.json"

    /**
     * Determines the "<projectFolder>" token that can be used with other config file settings.  The project folder
     * typically contains the tsconfig.json and package.json config files, but the path is user-defined.
     *
     * The path is resolved relative to the folder of the config file that contains the setting.
     *
     * The default value for "projectFolder" is the token "<lookup>", which means the folder is determined by traversing
     * parent folders, starting from the folder containing api-extractor.json, and stopping at the first folder
     * that contains a tsconfig.json file.  If a tsconfig.json file cannot be found in this way, then an error
     * will be reported.
     *
     * SUPPORTED TOKENS: <lookup>
     * DEFAULT VALUE: "<lookup>"
     */
    projectFolder: cwd,

    /**
     * (REQUIRED) Specifies the .d.ts file to be used as the starting point for analysis.  API Extractor
     * analyzes the symbols exported by this module.
     *
     * The file extension must be ".d.ts" and not ".ts".
     *
     * The path is resolved relative to the folder of the config file that contains the setting; to change this,
     * prepend a folder token such as "<projectFolder>".
     *
     * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
     */
    mainEntryPointFilePath: `${out}/dist-types/index.d.ts`,

    /**
     * Determines how the TypeScript compiler engine will be invoked by API Extractor.
     */
    compiler: {
      tsconfigFilePath: tsConfigPath,
      /**
       * Provides a compiler configuration that will be used instead of reading the tsconfig.json file from disk.
       * The object must conform to the TypeScript tsconfig schema:
       *
       * http://json.schemastore.org/tsconfig
       *
       * If omitted, then the tsconfig.json file will be read from the "projectFolder".
       *
       * DEFAULT VALUE: no overrideTsconfig section
       */
      // "overrideTsconfig": {
      //   . . .
      // }
      /**
       * This option causes the compiler to be invoked with the --skipLibCheck option. This option is not recommended
       * and may cause API Extractor to produce incomplete or incorrect declarations, but it may be required when
       * dependencies contain declarations that are incompatible with the TypeScript engine that API Extractor uses
       * for its analysis.  Where possible, the underlying issue should be fixed rather than relying on skipLibCheck.
       *
       * DEFAULT VALUE: false
       */
      // "skipLibCheck": true,
    },

    /**
     * Configures how the API report file (*.api.md) will be generated.
     */
    apiReport: {enabled: false, reportFileName: 'report.api.md'},
    docModel: {enabled: false},
    tsdocMetadata: {enabled: false},
    dtsRollup: {
      enabled: true,
      /**
       * Specifies the output path for a .d.ts rollup file to be generated without any trimming.
       * This file will include all declarations that are exported by the main entry point.
       *
       * If the path is an empty string, then this file will not be written.
       *
       * The path is resolved relative to the folder of the config file that contains the setting; to change this,
       * prepend a folder token such as "<projectFolder>".
       *
       * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
       * DEFAULT VALUE: "<projectFolder>/dist/<unscopedPackageName>.d.ts"
       */
      untrimmedFilePath: `${out}/dist-types-bundled/index.d.ts`,
    },

    /**
     * Configures how API Extractor reports error and warning messages produced during analysis.
     *
     * There are three sources of messages:  compiler messages, API Extractor messages, and TSDoc messages.
     */
    messages: {
      /**
       * Configures handling of diagnostic messages reported by the TypeScript compiler engine while analyzing
       * the input .d.ts files.
       *
       * TypeScript message identifiers start with "TS" followed by an integer.  For example: "TS2551"
       *
       * DEFAULT VALUE:  A single "default" entry with logLevel=warning.
       */
      compilerMessageReporting: {
        /**
         * Configures the default routing for messages that don't match an explicit rule in this table.
         */
        default: {
          /**
           * Specifies whether the message should be written to the the tool's output log.  Note that
           * the "addToApiReportFile" property may supersede this option.
           *
           * Possible values: "error", "warning", "none"
           *
           * Errors cause the build to fail and return a nonzero exit code.  Warnings cause a production build fail
           * and return a nonzero exit code.  For a non-production build (e.g. when "api-extractor run" includes
           * the "--local" option), the warning is displayed but the build will not fail.
           *
           * DEFAULT VALUE: "warning"
           */
          logLevel: 'error',

          /**
           * When addToApiReportFile is true:  If API Extractor is configured to write an API report file (.api.md),
           * then the message will be written inside that file; otherwise, the message is instead logged according to
           * the "logLevel" option.
           *
           * DEFAULT VALUE: false
           */
          // "addToApiReportFile": false
        },

        // "TS2551": {
        //   "logLevel": "warning",
        //   "addToApiReportFile": true
        // },
        //
        // . . .
      },

      /**
       * Configures handling of messages reported by API Extractor during its analysis.
       *
       * API Extractor message identifiers start with "ae-".  For example: "ae-extra-release-tag"
       *
       * DEFAULT VALUE: See api-extractor-defaults.json for the complete table of extractorMessageReporting mappings
       */
      // extractorMessageReporting: {
      //   default: {
      //     logLevel: "error"
      //   }
      // },
      //     // "addToApiReportFile": false
      //   }

      //   // "ae-extra-release-tag": {
      //   //   "logLevel": "warning",
      //   //   "addToApiReportFile": true
      //   // },
      //   //
      //   // . . .
      // },

      /**
       * Configures handling of messages reported by the TSDoc parser when analyzing code comments.
       *
       * TSDoc message identifiers start with "tsdoc-".  For example: "tsdoc-link-tag-unescaped-text"
       *
       * DEFAULT VALUE:  A single "default" entry with logLevel=warning.
       */
      // tsdocMessageReporting: {
      //   default: {
      //     logLevel: "warning"
      //   }
      // }
      //     // "addToApiReportFile": false
      //   }

      //   // "tsdoc-link-tag-unescaped-text": {
      //   //   "logLevel": "warning",
      //   //   "addToApiReportFile": true
      //   // },
      //   //
      //   // . . .
      // }
    },
  } as IConfigFile;
}

function getTsConfigPath(options, cwd) {
  return path.resolve(cwd, options.tsconfig || 'tsconfig.json');
}

export async function beforeBuild({cwd, options}: BuilderOptions) {
  const tsConfigPath = getTsConfigPath(options, cwd);
  if (!fs.existsSync(tsConfigPath)) {
    throw new MessageError('"tsconfig.json" manifest not found.');
  }
}

export async function beforeJob({out}: BuilderOptions) {
  const typesDir = path.join(out, 'dist-types');
  if (!fs.existsSync(typesDir)) {
    throw new MessageError('No "dist-types/" folder exists to bundle.');
  }

  const typesEntrypoint = path.join(out, 'dist-types/index.d.ts');
  if (!fs.existsSync(typesEntrypoint)) {
    throw new MessageError('A "dist-types/index.d.ts" entrypoint is required, but none was found.');
  }
}

export function manifest(manifest, {options}: BuilderOptions) {
  if (options.entrypoint !== null) {
    let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];
    if (typeof keys === 'string') {
      keys = [keys];
    }
    for (const key of keys) {
      manifest[key] = manifest[key] || 'dist-types/index.d.ts';
    }
  }
}

export async function build({cwd, out, options, reporter, manifest}: BuilderOptions): Promise<void> {
  const typesBundledLoc = path.join(out, 'dist-types-bundled/');
  const typesLoc = path.join(out, 'dist-types/');

  // Load and parse the api-extractor.json file
  const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
    configObject: getConfigData(cwd, out, getTsConfigPath(options, cwd)),
    configObjectFullPath: undefined,
    packageJson: manifest,
    packageJsonFullPath: path.join(cwd, 'package.json'),
  });
  (extractorConfig as any).packageJson = manifest;

  // Invoke API Extractor to generate a bundled index.d.ts from the dist-types-unbundled/ dir.
  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {localBuild: false});

  // Handle a failure
  if (!extractorResult.succeeded) {
    throw new MessageError(
      `Unable to bundle types. ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings encountered.`,
    );
  }

  rimraf.sync(typesLoc);
  fs.renameSync(typesBundledLoc, typesLoc);
  reporter.created(path.join(out, 'dist-types', 'index.d.ts'), 'types, bundled');
}
