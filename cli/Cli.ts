import {program} from "commander"
import {resolve} from "path"
import {rmSync, writeFileSync} from "fs"
import {exec} from "child_process"

program.option('-w, --workflow <type>', 'relative path to workflow file')
program.option('-n, --name <type>', 'workflow name to compile in the file')
program.parse(process.argv)
const options = program.opts()
const wfBuildTsConfigFileName = 'tsconfig.workflow_build.json'
const wfBuildTsConfigContent = 
`{
    "compilerOptions": {
      "target": "es5",
      "module": "CommonJS",
      "outDir": "_workflow_compile_",
      "lib": ["ESNext", "dom"],
      "allowJs": false,
      "sourceMap": true,
      "experimentalDecorators": false,
      "noUnusedLocals": false,
      "esModuleInterop": true,
      "moduleResolution": "node",
      "types": [
        "node",
        "jest",
      ],
      "jsx": "react"
    }
  }
`

const dumpWorkflowScriptName = "dump_workflow_script.ts"

if (options.workflow && options.name) {
  rmSync(resolve(wfBuildTsConfigFileName), {force: true, recursive: true})
  rmSync(resolve(dumpWorkflowScriptName), {force: true, recursive: true})
  rmSync(resolve("./_workflow_compile_"), {force: true, recursive: true})

  let workflowTrimPath = options.workflow.substring(0, options.workflow.lastIndexOf('.'))
let dumpWorkflowScript = `
import { buildJsxWorkflow } from "taskflow-react"
import { dumpWorkflow } from "taskflow-react"
import {${options.name}} from "${workflowTrimPath}"
const workflow = buildJsxWorkflow(${options.name})
export const dumpWorkflowText = dumpWorkflow(workflow)
`
    writeFileSync(resolve(`./${wfBuildTsConfigFileName}`), wfBuildTsConfigContent)
    writeFileSync(resolve(`./${dumpWorkflowScriptName}`), dumpWorkflowScript)
    exec(`tsc --project ${wfBuildTsConfigFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return;
      }

      const result = require("../../../_workflow_compile_/dump_workflow_script")
      console.log("\x1b[32m", result["dumpWorkflowText"])
      console.log("\x1b[37m")
      rmSync(resolve(wfBuildTsConfigFileName), {force: true, recursive: true})
      rmSync(resolve(dumpWorkflowScriptName), {force: true, recursive: true})
      rmSync(resolve("./_workflow_compile_"), {force: true, recursive: true})
    });
}
