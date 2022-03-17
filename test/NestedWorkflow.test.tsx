import { WorkflowInputProps } from "../src/WorkflowComponent";
import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";
import { add, double } from "./NodeExample";

test("nested workflow test", async () => {


    function InnerAdd(props: WorkflowInputProps) {
        return <WorkflowComponent {...props}>
            <InputNodeComponent params={["num1", "num2"]} />
            <InnerDouble params={["num2"]} name="double" />
            <NodeComponent name="add" gen={add} deps={["num1", "double.output"]} />
            <OutputNodeComponent name="output" dep="add" />
        </WorkflowComponent>
    }

    function InnerDouble(props: WorkflowInputProps) {
        return <WorkflowComponent {...props}>
            <InputNodeComponent params={["num"]} />
            <NodeComponent name="double" gen={double} deps={["num"]} />
            <OutputNodeComponent name="output" dep="double" />
        </WorkflowComponent>
    }

    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <InnerAdd name="add" params={["num1", "num2"]} />
        <InnerDouble name="double" params={["num3"]} />
        <NodeComponent gen={add} name="finalAdd" deps={["add.output", "double.output"]} />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(result["res"]).toBe(11)
})
