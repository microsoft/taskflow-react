import { buildJsxWorkflow, dumpWorkflow } from "../src"
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent"
import { add, AddWithDoubleWorkflow, double, DoubleWorkflow } from "./NodeWorkflowExample"

test('dump workflow test', () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    let dumpWorkflowText = dumpWorkflow(workflow)
    expect(dumpWorkflowText).toEqual('{inputs:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},],zeroDepNodes:[],nodes:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},{id:3,deps:[0,1],gen:add},{id:4,deps:[2],gen:double},{id:5,deps:[3,4],gen:add},],outputs:{5:"res",},binding:{0:[3],1:[3],2:[4],3:[5],4:[5],},}')
})

test('dump nested workflow test', () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <AddWithDoubleWorkflow name="add" params={["num1", "num2"]} />
        <DoubleWorkflow name="double" params={["num3"]} />
        <NodeComponent gen={add} name="finalAdd" deps={["add.output", "double.output"]} />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    let dumpWorkflowText = dumpWorkflow(workflow)
    expect(dumpWorkflowText).toEqual('{inputs:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},],zeroDepNodes:[],nodes:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},{id:3,deps:[0],gen:unitNodeGenerator},{id:4,deps:[1],gen:unitNodeGenerator},{id:5,deps:[4],gen:unitNodeGenerator},{id:6,deps:[5],gen:double},{id:7,deps:[3,6],gen:add},{id:8,deps:[2],gen:unitNodeGenerator},{id:9,deps:[8],gen:double},{id:10,deps:[7,9],gen:add},],outputs:{10:"res",},binding:{0:[3],1:[4],2:[8],3:[7],4:[5],5:[6],6:[7],7:[10],8:[9],9:[10],},}')
})