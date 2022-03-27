import React from "react";
import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";
import { add, AddWithDoubleWorkflow, DoubleWorkflow } from "./NodeWorkflowExample";

test("nested workflow test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <AddWithDoubleWorkflow name="add" params={["num1", "num2"]} />
        <DoubleWorkflow name="double" params={["num3"]} />
        <NodeComponent gen={add} name="finalAdd" deps={["add.output", "double.output"]} />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(result["res"]).toBe(11)
})
