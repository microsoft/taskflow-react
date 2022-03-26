'use strict';

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

commander.program.option('-w, --workflow <type>', 'relative path to workflow file');
commander.program.option('-n, --name <type>', 'workflow name to compile in the file');
commander.program.parse(process.argv);
var options = commander.program.opts();
var wfBuildTsConfigFileName = 'tsconfig.workflow_build.json';
var wfBuildTsConfigContent = "{\n    \"compilerOptions\": {\n      \"target\": \"es5\",\n      \"module\": \"CommonJS\",\n      \"outDir\": \"_workflow_compile_\",\n      \"lib\": [\"ESNext\", \"dom\"],\n      \"allowJs\": false,\n      \"sourceMap\": true,\n      \"experimentalDecorators\": false,\n      \"noUnusedLocals\": false,\n      \"esModuleInterop\": true,\n      \"moduleResolution\": \"node\",\n      \"types\": [\n        \"node\",\n        \"jest\",\n      ],\n      \"jsx\": \"react-jsx\"\n    }\n  }\n";
var dumpWorkflowScriptName = "dump_workflow_script.ts";
if (options.workflow && options.name) {
    fs.rmSync(path.resolve(wfBuildTsConfigFileName), { force: true, recursive: true });
    fs.rmSync(path.resolve(dumpWorkflowScriptName), { force: true, recursive: true });
    fs.rmSync(path.resolve("./_workflow_compile_"), { force: true, recursive: true });
    var workflowTrimPath = options.workflow.substring(0, options.workflow.lastIndexOf('.'));
    var dumpWorkflowScript = "\nimport { buildJsxWorkflow } from \"taskflow-react\"\nimport { dumpWorkflow } from \"taskflow-react\"\nimport {".concat(options.name, "} from \"").concat(workflowTrimPath, "\"\nconst workflow = buildJsxWorkflow(").concat(options.name, ")\nexport const dumpWorkflowText = dumpWorkflow(workflow)\n");
    fs.writeFileSync(path.resolve("./".concat(wfBuildTsConfigFileName)), wfBuildTsConfigContent);
    fs.writeFileSync(path.resolve("./".concat(dumpWorkflowScriptName)), dumpWorkflowScript);
    child_process.execSync("tsc --project ".concat(wfBuildTsConfigFileName));
    var result = require("../_workflow_compile_/dump_workflow_script");
    console.log("\x1b[32m", result["dumpWorkflowText"]);
    console.log("\x1b[37m");
    fs.rmSync(path.resolve(wfBuildTsConfigFileName), { force: true, recursive: true });
    fs.rmSync(path.resolve(dumpWorkflowScriptName), { force: true, recursive: true });
    fs.rmSync(path.resolve("./_workflow_compile_"), { force: true, recursive: true });
}
