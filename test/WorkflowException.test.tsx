import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor, ExecutionStatus } from "../src/WorkflowExecutor";
import { add, double } from "./NodeWorkflowExample";
import React from "react";
import { asyncExceptionDouble, exceptionDouble } from "./NodeExample";

test("sync workflow exception test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="add1" />
        <NodeComponent gen={exceptionDouble} deps={["add1"]} name="res" />
        <OutputNodeComponent name="res" dep="res" />
        <OutputNodeComponent name="addRes" dep="add1" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(workflowExecutor.state()).toBe(ExecutionStatus.Failure)
    expect("res" in result).toBe(false)
    expect(result["addRes"]).toBe(9)
})

test("async workflow exception test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="add1" />
        <NodeComponent gen={asyncExceptionDouble} deps={["add1"]} name="res" />
        <OutputNodeComponent name="res" dep="res" />
        <OutputNodeComponent name="addRes" dep="add1" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(workflowExecutor.state()).toBe(ExecutionStatus.Failure)
    expect("res" in result).toBe(false)
    expect(result["addRes"]).toBe(9)
})
