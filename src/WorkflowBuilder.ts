import { Workflow } from "./Workflow"
import { WorkflowNode } from "./WorkflowNode"

export interface WorkflowBuilder {
    build() : Workflow;
    input(nodes: WorkflowNode[]) : WorkflowBuilder;
    next(nodes: WorkflowNode[]) : WorkflowBuilder;
    output(output: Record<number, string>) : WorkflowBuilder;
}

export function createWorkflowBuilder() : WorkflowBuilder {
    let inputs: WorkflowNode[] = []
    const zeroDepNodes: WorkflowNode[] = []
    let outputs: Record<number, string> = {}
    let nodes: WorkflowNode[] = []
    const binding: Record<number, number[]> = {}
    const builder : WorkflowBuilder = {
        build: () => {
            nodes = nodes.concat(inputs)
            nodes.sort((a: WorkflowNode, b: WorkflowNode) => {
                return a.id > b.id ? 1 : -1
            })

            const workflow: Workflow = {
                inputs: inputs,
                outputs: outputs,
                nodes: nodes,
                binding: binding,
                zeroDepNodes: zeroDepNodes
            }

            return workflow
        },
    
        input: (nodes: WorkflowNode[]) => {
            inputs = nodes
            return builder
        },
    
        output: (output: Record<number, string>) => {
            outputs = output
            return builder
        },
    
        next: (nextNodes: WorkflowNode[]) => {
            for (const node of nextNodes) {
                if (node.deps.length == 0) {
                    zeroDepNodes.push(node)
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
        }
    }

    return builder
}
