import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";
import { ComputationWorkflow } from "./NodeWorkflowExample";
import React from "react";

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