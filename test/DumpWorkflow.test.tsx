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
    expect(dumpWorkflowText).toEqual('{inputs:[0,1,2],zeroDepNodes:[],nodes:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},{id:3,deps:[0,1],gen:add},{id:4,deps:[2],gen:double},{id:5,deps:[3,4],gen:add},],outputs:{5:"res",},binding:{0:[3],1:[3],2:[4],3:[5],4:[5],},}')
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
    expect(dumpWorkflowText).toEqual('{inputs:[0,1,2],zeroDepNodes:[],nodes:[{id:0,deps:[],gen:unitNodeGenerator},{id:1,deps:[],gen:unitNodeGenerator},{id:2,deps:[],gen:unitNodeGenerator},{id:3,deps:[1],gen:double},{id:4,deps:[0,3],gen:add},{id:5,deps:[2],gen:double},{id:6,deps:[4,5],gen:add},],outputs:{6:"res",},binding:{0:[4],1:[3],2:[5],3:[4],4:[6],5:[6],},}')
})