import {WorkflowExecutionNode, WorkflowComponent, InputNodeComponent, NodeComponent, OutputNodeComponent, buildJsxWorkflow, createWorkflowExecutor} from "taskflow-react"

function asyncAddNode() : WorkflowExecutionNode {
    return {
        run(num1: number, num2: number) {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num1 + num2);
                }, 500)
            })
        }
    }
}

function asyncDoubleNode() : WorkflowExecutionNode {
    return {
        run(num1: number) {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(2 * num1);
                }, 500)
            })
        }
    }
}

function createComputationWorkflow() {
    return <WorkflowComponent>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={asyncAddNode} deps={["num1", "num2"]} name="add"/>
        <NodeComponent gen={asyncDoubleNode} deps={["num3"]} name="double"/>
        <NodeComponent gen={asyncAddNode} deps={["add", "double"]} name="add1"/>
        <NodeComponent gen={asyncDoubleNode} deps={["add1"]} name="double1"/>
        <OutputNodeComponent name="output" dep="double1" />
    </WorkflowComponent>
}

const workflow = buildJsxWorkflow(createComputationWorkflow());
export const computationWorkflowExecutor = createWorkflowExecutor(workflow);
