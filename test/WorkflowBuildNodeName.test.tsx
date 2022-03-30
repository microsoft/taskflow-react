import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent, WorkflowInputProps } from "../src/WorkflowComponent";
import { unitNodeGenerator } from "../src/WorkflowNode";
import { add, AddWithDoubleWorkflow, double, DoubleWorkflow } from "./NodeWorkflowExample";
import React from "react";
import { createWorkflowExecutor } from "../src/WorkflowExecutor";

test("workflow node name test", async () => {
    const workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    const workflow = buildJsxWorkflow(workflowJsx, true)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(6)
    const ndoeNameMap = workflow.nodeNames
    expect(Object.keys(ndoeNameMap).length).toBe(6)
    expect(ndoeNameMap[0]).toBe(".num1")
    expect(ndoeNameMap[1]).toBe(".num2")
    expect(ndoeNameMap[2]).toBe(".num3")
    expect(ndoeNameMap[3]).toBe(".add")
    expect(ndoeNameMap[4]).toBe(".double")
    expect(ndoeNameMap[5]).toBe(".finalAdd")
})

function ComputationWorkflow(props: WorkflowInputProps) {
    return (<WorkflowComponent {...props}>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
}

test("nested workflow node name test", async () => {
    const workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="add1" />
        <ComputationWorkflow name="comp" params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["add1", "comp.res"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    const workflow = buildJsxWorkflow(workflowJsx, true)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(10)
    const ndoeNameMap = workflow.nodeNames
    expect(Object.keys(ndoeNameMap).length).toBe(10)
    expect(ndoeNameMap[0]).toBe(".num1")
    expect(ndoeNameMap[1]).toBe(".num2")
    expect(ndoeNameMap[2]).toBe(".num3")
    expect(ndoeNameMap[3]).toBe(".add")
    expect(ndoeNameMap[4]).toBe(".double")
    expect(ndoeNameMap[5]).toBe(".add1")
    expect(ndoeNameMap[6]).toBe(".comp.add")
    expect(ndoeNameMap[7]).toBe(".comp.double")
    expect(ndoeNameMap[8]).toBe(".comp.finalAdd")
    expect(ndoeNameMap[9]).toBe(".finalAdd")
})

test("nested nested workflow node name test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <AddWithDoubleWorkflow name="add" params={["num1", "num2"]} />
        <DoubleWorkflow name="double" params={["num3"]} />
        <NodeComponent gen={add} name="finalAdd" deps={["add.output", "double.output"]} />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    let workflow = buildJsxWorkflow(workflowJsx, true)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(7)
    const ndoeNameMap = workflow.nodeNames
    expect(Object.keys(ndoeNameMap).length).toBe(7)
    expect(ndoeNameMap[0]).toBe(".num1")
    expect(ndoeNameMap[1]).toBe(".num2")
    expect(ndoeNameMap[2]).toBe(".num3")
    expect(ndoeNameMap[3]).toBe(".add.double.double")
    expect(ndoeNameMap[4]).toBe(".add.add")
    expect(ndoeNameMap[5]).toBe(".double.double")
    expect(ndoeNameMap[6]).toBe(".finalAdd")   
})
