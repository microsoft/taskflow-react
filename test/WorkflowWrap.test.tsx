import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";
import { add } from "./NodeWorkflowExample";

function Workflow1() {
    return (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2"]} />
        <NodeComponent gen={add} name="add" deps={["num1", "num2"]} />
        <OutputNodeComponent name="res" dep="add" />
    </WorkflowComponent>)
}

function Workflow2() {
    return <Workflow1 />
}

function Workflow3() {
    return <Workflow2 />
}

function Workflow4() {
    return <Workflow3 />
}

function Workflow5() {
    return <Workflow4 />
}

function Workflow6() {
    return <Workflow5 />
}

test("async workflow test", async () => {
    let workflow = buildJsxWorkflow(<Workflow6 />)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(3)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2)
    expect(result["res"]).toBe(3)
})