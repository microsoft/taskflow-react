export interface WorkflowExecutionNode {
    run: (...params: any[]) => any;
    cancel?: () => void;
}

export interface WorkflowNode {
    gen: () => WorkflowExecutionNode;
    id: number;
    deps: number[];
}
