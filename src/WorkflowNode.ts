export interface WorkflowExecutionNode {
    run: (...params: any[]) => any;
    cancel?: () => void;
}

export interface WorkflowNode {
    gen: () => WorkflowExecutionNode;
    id: number;
    deps: number[];
}

export function unitNodeGenerator() : WorkflowExecutionNode {
    return {
        run: (param: any) => {
            return param
        }
    }
}
