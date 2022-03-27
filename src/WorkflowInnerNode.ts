import { WorkflowExecutionNode } from "./WorkflowNode";

export interface WorkflowRunTimeNode {
    node: WorkflowExecutionNode;
    id: number;
    inputs: any[];
}

