import React from "react";
import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { createWorkflowExecutor, ExecutionStatus } from "../src/WorkflowExecutor";
import { asyncAdd, asyncDouble } from "./NodeWorkflowExample";

test("workflow inst test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={asyncAdd} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={asyncDouble} deps={["num3"]} name="double" />
        <NodeComponent gen={asyncAdd} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    let workflowExecutor = createWorkflowExecutor(workflow)
    workflowExecutor.inst(true)
    let result = await workflowExecutor.run(1, 2, 3)
    expect(result["res"]).toBe(9)
    let stats = workflowExecutor.stats()
    expect(stats.length).toBe(workflow.nodes.length)
    for (const nodeStat of stats) {
        expect(nodeStat.status).toBe(ExecutionStatus.Done)
    }
})
