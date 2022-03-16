import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent, WorkflowInputProps } from "../src/WorkflowComponent";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";
import { add, double } from "./NodeExample";

function ComputationWorkflow(props: WorkflowInputProps) {
    return (<WorkflowComponent {...props}>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
}

test("top level workflow test", async () => {
    let topLevelWorkflow = <ComputationWorkflow />
    let workflow = buildJsxWorkflow(topLevelWorkflow)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(result["res"]).toBe(9)
})

test("workflow reuse test", async () => {
    let topLevelWorkflow = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <ComputationWorkflow name="comp" params={["num1", "num2", "num3"]} />
        <OutputNodeComponent name="res" dep="comp.res" />
    </WorkflowComponent>)

    let workflow = buildJsxWorkflow(topLevelWorkflow)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(result["res"]).toBe(9)
})