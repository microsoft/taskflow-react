import {program} from "commander"
import {resolve} from "path"
import {mkdirSync, rmSync, writeFileSync} from "fs"
import {exec} from "child_process"

program.option('-w, --workflow <type>', 'relative path to workflow file')
program.option('-n, --name <type>', 'workflow name to compile in the file')
program.parse(process.argv)
const options = program.opts()
const wfBuildGenFolder = '_workflow_gen_'
const wfBuildCompileFolder = '_workflow_compile_'
const wfBuildTsConfigFileName = 'tsconfig.workflow_build.json'
const wfBuildTsConfigContent = 
`{
    "compilerOptions": {
      "target": "es5",
      "module": "CommonJS",
      "outDir": "../${wfBuildCompileFolder}",
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

const dumpWorkflowScriptModuleName = "dump_workflow_script"
if (options.workflow && options.name) {
  rmSync(resolve(`./${wfBuildGenFolder}`), {force: true, recursive: true})
  rmSync(resolve(`./${wfBuildCompileFolder}`), {force: true, recursive: true})

  mkdirSync(resolve(`./${wfBuildGenFolder}`))
  let workflowTrimPath = options.workflow.substring(0, options.workflow.lastIndexOf('.'))
  let dumpWorkflowScript = `
import { buildJsxWorkflow } from "taskflow-react"
import { dumpWorkflow } from "taskflow-react"
import {${options.name}} from "../${workflowTrimPath}"
const workflow = buildJsxWorkflow(${options.name})
const workflowWithName = buildJsxWorkflow(${options.name}, true)
export const dumpWorkflowText = dumpWorkflow(workflow)
export const dumpWorkflowwTextWithName = dumpWorkflow(workflowWithName)
`
    writeFileSync(resolve(`./${wfBuildGenFolder}/${wfBuildTsConfigFileName}`), wfBuildTsConfigContent)
    writeFileSync(resolve(`./${wfBuildGenFolder}/${dumpWorkflowScriptModuleName}.ts`), dumpWorkflowScript)
    exec(`tsc --project ./${wfBuildGenFolder}/${wfBuildTsConfigFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return;
      }

      const result = require(`../../../${wfBuildCompileFolder}/${wfBuildGenFolder}/${dumpWorkflowScriptModuleName}`)
      console.log("\x1b[32m", "export const " + options.name + "Gen = " + result["dumpWorkflowText"] + "\n\n")
      console.log("\x1b[32m", "export const " + options.name + "GenWithName = " + result["dumpWorkflowwTextWithName"] + "\n\n")
      console.log("\x1b[37m")
      rmSync(resolve(`./${wfBuildGenFolder}`), {force: true, recursive: true})
      rmSync(resolve(`./${wfBuildCompileFolder}`), {force: true, recursive: true})
    });
}
