import { WorkflowExecutionNode } from "./WorkflowNode";

export interface WorkflowRunTimeNode {
    node: WorkflowExecutionNode;
    id: number;
    inputs: any[];
}

export function unitNodeGenerator() : WorkflowExecutionNode {
    return {
        run: (param: any) => {
            return param
        }
    }
}
