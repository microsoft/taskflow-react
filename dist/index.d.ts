import React from 'react';

interface WorkflowExecutionNode {
    run: (...params: any[]) => any;
    cancel?: () => void;
}
interface WorkflowNode {
    gen: () => WorkflowExecutionNode;
    id: number;
    deps: number[];
}

interface Workflow {
    inputs: number[];
    zeroDepNodes: number[];
    nodes: WorkflowNode[];
    outputs: Record<number, string>;
    binding: Record<number, number[]>;
}
declare enum WorkflowValidationStatus {
    OK = 0,
    EmptyWorkflow = 1,
    NodesDisorder = 2,
    InputOutOfNodes = 3,
    ZeroDepOutOfNodes = 4,
    OutputOutOfNodes = 5,
    BindingOutOfNodes = 6,
    DepNotFoundInBinding = 7,
    BindingNotFoundInDep = 8,
    CircularDetected = 9
}
declare function dumpWorkflow(workflow: Workflow): string;
declare function validateWorkflow(workflow: Workflow): WorkflowValidationStatus;

declare function buildJsxWorkflow(elementDefinition: React.ReactElement): Workflow;

interface WorkflowProps {
    children: JSX.Element[];
}
interface WorkflowInputProps {
    name?: string;
    params?: string[];
}
interface NodeProps {
    gen: () => WorkflowExecutionNode;
    name: string;
    deps?: string[];
}
interface InputNodeProps {
    params: string[];
}
interface OutputNodeProps {
    name: string;
    dep: string;
}
declare function NodeComponent(props: NodeProps): any;
declare function WorkflowComponent(props: WorkflowProps): any;
declare function InputNodeComponent(props: InputNodeProps): any;
declare function OutputNodeComponent(props: OutputNodeProps): any;

declare enum ExecutionStatus {
    NotStarted = 0,
    Running = 1,
    Cancelled = 2,
    Failure = 3,
    Done = 4
}
interface WorkflowExecutor {
    cancel(): void;
    run(...params: any[]): Promise<any>;
    setTimeout(timeout: number): void;
    reset(): void;
    state(): ExecutionStatus;
}
declare function createWorkflowExecutor(wf: Workflow): WorkflowExecutor;

export { ExecutionStatus, InputNodeComponent, InputNodeProps, NodeComponent, NodeProps, OutputNodeComponent, OutputNodeProps, Workflow, WorkflowComponent, WorkflowExecutionNode, WorkflowExecutor, WorkflowInputProps, WorkflowNode, WorkflowProps, WorkflowValidationStatus, buildJsxWorkflow, createWorkflowExecutor, dumpWorkflow, validateWorkflow };
