import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { validateWorkflow, WorkflowValidationStatus } from "../src/Workflow";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent, WorkflowInputProps } from "../src/WorkflowComponent";
import { unitNodeGenerator } from "../src/WorkflowInnerNode";
import { add, double } from "./NodeExample";

test("workflow id test", async () => {
    const workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    const workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(6)

    expect(workflow.nodes[0].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[1].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[2].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[3].gen).toBe(add)
    expect(workflow.nodes[4].gen).toBe(double)
    expect(workflow.nodes[5].gen).toBe(add)

    expect(workflow.nodes[0].deps.length).toBe(0)
    expect(workflow.nodes[1].deps.length).toBe(0)
    expect(workflow.nodes[2].deps.length).toBe(0)
    expect(workflow.nodes[3].deps).toEqual([0, 1])
    expect(workflow.nodes[4].deps).toEqual([2])
    expect(workflow.nodes[5].deps).toEqual([3, 4])

    expect(workflow.binding[0]).toEqual([3])
    expect(workflow.binding[1]).toEqual([3])
    expect(workflow.binding[2]).toEqual([4])
    expect(workflow.binding[3]).toEqual([5])
    expect(workflow.binding[4]).toEqual([5])
    expect(workflow.binding[5]).toBe(undefined)
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

test("nested workflow id test", async () => {
    const workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="add1" />
        <ComputationWorkflow name="comp" params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["add1", "comp.res"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    const workflow = buildJsxWorkflow(workflowJsx)
    expect(validateWorkflow(workflow)).toBe(WorkflowValidationStatus.OK)
    expect(workflow.nodes.length).toBe(13)

    expect(workflow.nodes[0].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[1].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[2].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[3].gen).toBe(add)
    expect(workflow.nodes[4].gen).toBe(double)
    expect(workflow.nodes[5].gen).toBe(add)
    expect(workflow.nodes[6].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[7].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[8].gen).toBe(unitNodeGenerator)
    expect(workflow.nodes[9].gen).toBe(add)
    expect(workflow.nodes[10].gen).toBe(double)
    expect(workflow.nodes[11].gen).toBe(add)
    expect(workflow.nodes[12].gen).toBe(add)

    expect(workflow.nodes[0].deps.length).toBe(0)
    expect(workflow.nodes[1].deps.length).toBe(0)
    expect(workflow.nodes[2].deps.length).toBe(0)
    expect(workflow.nodes[3].deps).toEqual([0, 1])
    expect(workflow.nodes[4].deps).toEqual([2])
    expect(workflow.nodes[5].deps).toEqual([3, 4])
    expect(workflow.nodes[6].deps).toEqual([0])
    expect(workflow.nodes[7].deps).toEqual([1])
    expect(workflow.nodes[8].deps).toEqual([2])
    expect(workflow.nodes[9].deps).toEqual([6, 7])
    expect(workflow.nodes[10].deps).toEqual([8])
    expect(workflow.nodes[11].deps).toEqual([9, 10])
    expect(workflow.nodes[12].deps).toEqual([5, 11])
})
