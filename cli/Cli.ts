import {program} from "commander"
import {resolve} from "path"
import {writeFileSync} from "fs"
import {execSync, spawnSync} from "child_process"


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
      "jsx": "react-jsx"
    }
  }
`

const dumpWorkflowScriptName = "dump_workflow_script.ts"

if (options.workflow && options.name) {
    let workflowTrimPath = options.workflow.substring(0, options.workflow.lastIndexOf('.'))
let dumpWorkflowScript = `
import { buildJsxWorkflow } from "./src/ReactElementWorkflowBuilder"
import { dumpWorkflow } from "./src/Workflow"
import {${options.name}} from "${workflowTrimPath}"
const workflow = buildJsxWorkflow(${options.name})
const dumpWorkflowText = dumpWorkflow(workflow)
console.log(dumpWorkflowText)
`
    const workflowPath = resolve(options.workflow)
    writeFileSync(resolve(`./${wfBuildTsConfigFileName}`), wfBuildTsConfigContent)
    writeFileSync(resolve(`./${dumpWorkflowScriptName}`), dumpWorkflowScript)
    execSync(`tsc --project ${wfBuildTsConfigFileName}`)
    let child = spawnSync("node ./_workflow_compile_/dump_workflow_script.js")
    console.log(child.output)
}
