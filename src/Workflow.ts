import { WorkflowNode } from "./WorkflowNode";

export interface Workflow {
    inputs: WorkflowNode[];
    zeroDepNodes: WorkflowNode[];
    nodes: WorkflowNode[];
    outputs: Record<number, string>;
    binding: Record<number, number[]>;
}

export enum WorkflowValidationStatus {
    OK = 0,
    EmptyWorkflow = 1,
    NodesDisorder = 2,
    InputOutOfNodes = 3,
    ZeroDepOutOfNodes = 4,
    OutputOutOfNodes = 5,
    BindingOutOfNodes = 6,
    DepNotFoundInBinding = 7,
    BindingNotFoundInDep = 8,
    CircularDetected = 9,
}

function circleDetection(statusArr: number[], id: number, workflow: Workflow) : boolean {
    if (statusArr[id] == 2) {
        return true
    }

    if (statusArr[id] == 1) {
        return false
    }

    statusArr[id] = 1
    if (id in workflow.binding) {
        for (const dst of workflow.binding[id]) {
            if (!circleDetection(statusArr, dst, workflow)) {
                return false
            }
        }
    }

    statusArr[id] = 2
    return true
}

export function validateWorkflow(workflow: Workflow) : WorkflowValidationStatus {
    const nodeLength = workflow.nodes.length
    if (nodeLength <= 0) {
        return WorkflowValidationStatus.EmptyWorkflow
    }

    for (let inx = 0; inx < nodeLength; ++inx) {
        if (workflow.nodes[inx].id != inx) {
            return WorkflowValidationStatus.NodesDisorder
        }
    }

    for (const input of workflow.inputs) {
        if (workflow.nodes.indexOf(input) < 0) {
            return WorkflowValidationStatus.InputOutOfNodes
        }
    }

    for (const zeroDepNode of workflow.zeroDepNodes) {
        if (workflow.nodes.indexOf(zeroDepNode) < 0) {
            return WorkflowValidationStatus.ZeroDepOutOfNodes
        }
    }

    const outputKeys = Object.keys(workflow.outputs)
    for (const outputKey of outputKeys) {
        const outputId = parseInt(outputKey)
        if (outputId < 0 || outputId >= nodeLength) {
            return WorkflowValidationStatus.OutputOutOfNodes
        }
    }

    for (const bind in workflow.binding) {
        const bindingId = parseInt(bind)
        if (bindingId < 0 || bindingId >= nodeLength) {
            return WorkflowValidationStatus.BindingOutOfNodes
        }

        const dstArr = workflow.binding[bindingId]
        for (const dst of dstArr) {
            if (dst < 0 || dst >= nodeLength) {
                return WorkflowValidationStatus.BindingOutOfNodes
            }
        }
    }

    // validate dep and binding
    for (const node of workflow.nodes) {
        if (node.deps.length) {
            for (const dep of node.deps) {
                if (dep in workflow.binding) {
                    continue
                }
                else {
                    return WorkflowValidationStatus.DepNotFoundInBinding
                }
            }
        }
    }

    for (const bind in workflow.binding) {
        const bindId = parseInt(bind)
        const dstArr = workflow.binding[bindId]
        for (const dst of dstArr) {
            const deps = workflow.nodes[dst].deps
            if (deps.indexOf(bindId) < 0) {
                return WorkflowValidationStatus.BindingNotFoundInDep
            }
        }
    }

    const statusArr: number[] = Array(nodeLength).fill(0)
    for (const node of workflow.nodes) {
        if (!circleDetection(statusArr, node.id, workflow)) {
            return WorkflowValidationStatus.CircularDetected
        }
    }

    return WorkflowValidationStatus.OK
}
