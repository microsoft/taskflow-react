import { WorkflowExecutionNode } from "./WorkflowNode";

export interface WorkflowProps {
    children: JSX.Element[];
}

export interface WorkflowInputProps {
    name?: string;
    params?: string[];
}

export interface NodeProps {
    gen: () => WorkflowExecutionNode;
    name: string;
    deps?: string[];
}

export interface InputNodeProps {
    params: string[];
}

export interface OutputNodeProps {
    name: string;
    dep: string;
}

export function NodeComponent(props: NodeProps) {
    return null;
}

export function WorkflowComponent(props: WorkflowProps) {
    return null;
}

export function InputNodeComponent(props: InputNodeProps) {
    return null;
}

export function OutputNodeComponent(props: OutputNodeProps) {
    return null;
}
