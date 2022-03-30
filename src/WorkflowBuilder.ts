import { Workflow } from "./Workflow"
import { WorkflowNode } from "./WorkflowNode"

export interface WorkflowBuilder {
    build() : Workflow;
    input(nodes: WorkflowNode[]) : WorkflowBuilder;
    next(nodes: WorkflowNode[]) : WorkflowBuilder;
    output(output: Record<number, string>) : WorkflowBuilder;
    nodeNames(namesMap: Record<number, string>) : WorkflowBuilder;
}

export function createWorkflowBuilder() : WorkflowBuilder {
    const inputs: number[] = []
    const zeroDepNodes: number[] = []
    let outputs: Record<number, string> = {}
    let nodes: WorkflowNode[] = []
    const binding: Record<number, number[]> = {}
    let idToNameMap: Record<number, string> | undefined = undefined
    const builder : WorkflowBuilder = {
        build: () => {
            nodes.sort((a: WorkflowNode, b: WorkflowNode) => {
                return a.id > b.id ? 1 : -1
            })

            const workflow: Workflow = {
                inputs: inputs,
                outputs: outputs,
                nodes: nodes,
                binding: binding,
                zeroDepNodes: zeroDepNodes,
                nodeNames: idToNameMap
            }

            return workflow
        },
    
        input: (inputNodes: WorkflowNode[]) => {
            nodes = nodes.concat(inputNodes)
            for (const inputNode of inputNodes) {
                inputs.push(inputNode.id)
            }

            return builder
        },
    
        output: (output: Record<number, string>) => {
            outputs = output
            return builder
        },
    
        next: (nextNodes: WorkflowNode[]) => {
            for (const node of nextNodes) {
                if (node.deps.length == 0) {
                    zeroDepNodes.push(node.id)
                }
    
                for (const dep of node.deps) {
                    if (dep in binding) {
                        binding[dep].push(node.id)
                    }
                    else{
                        binding[dep] = [node.id]
                    }
                }
            }

            nodes = nodes.concat(nextNodes)    
            return builder;
        },

        nodeNames: (nodeMap: Record<number, string>) => {
            idToNameMap = nodeMap
            return builder
        }
    }

    return builder
}
