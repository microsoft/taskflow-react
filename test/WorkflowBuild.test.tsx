import { assert } from "console";
import { buildJsxWorkflow } from "../src/ReactElementWorkflowBuilder";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "../src/WorkflowComponent";
import { add, double } from "./NodeExample";

test("workflow build order test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
    try{
        buildJsxWorkflow(workflowJsx)
        assert(false)
    } catch(err) {
        assert(true)
    }
})

test("workflow build duplicate test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="add" />
        <OutputNodeComponent name="res" dep="add" />
    </WorkflowComponent>)
    try{
        buildJsxWorkflow(workflowJsx)
        assert(false)
    } catch(err) {
        assert(true)
    }
})

test("workflow build non exist node test", async () => {
    let workflowJsx = (<WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="nonExistNode" />
    </WorkflowComponent>)
    try{
        buildJsxWorkflow(workflowJsx)
        assert(false)
    } catch(err) {
        assert(true)
    }
})

test("workflow build empty node test", async () => {
    let workflowJsx = (<WorkflowComponent>
    </WorkflowComponent>)
    try{
        buildJsxWorkflow(workflowJsx)
        assert(false)
    } catch(err) {
        assert(true)
    }
})
