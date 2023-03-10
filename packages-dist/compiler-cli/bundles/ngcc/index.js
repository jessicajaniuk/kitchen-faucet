
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  mainNgcc
} from "../chunk-KZV4A2HW.js";
import "../chunk-7DUI3BSX.js";
import {
  clearTsConfigCache
} from "../chunk-W6BZXD5M.js";
import "../chunk-NKNLPRTR.js";
import "../chunk-GTHJVVVJ.js";
import "../chunk-O4JLZZWJ.js";
import {
  ConsoleLogger,
  LogLevel
} from "../chunk-SBDNBITT.js";
import "../chunk-6ZJFIQBG.js";
import "../chunk-Z534TW2O.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../chunk-EC5K6QPP.js";
import "../chunk-NJMZRTB6.js";
import "../chunk-SRFZMXHZ.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/index.mjs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
function process(options) {
  setFileSystem(new NodeJSFileSystem());
  return mainNgcc(options);
}
var containingDirPath = dirname(fileURLToPath(import.meta.url));
var ngccMainFilePath = join(containingDirPath, "./main-ngcc.js");
export {
  ConsoleLogger,
  LogLevel,
  clearTsConfigCache,
  ngccMainFilePath,
  process
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index.js.map
