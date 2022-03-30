import React from "react";
import { Workflow } from "./Workflow";
import { createWorkflowBuilder, WorkflowBuilder } from "./WorkflowBuilder";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "./WorkflowComponent";
import { unitNodeGenerator } from "./WorkflowNode";
import { WorkflowNode } from "./WorkflowNode";
import {WorkflowProps, InputNodeProps, OutputNodeProps, NodeProps, WorkflowInputProps} from "./WorkflowComponent"

let workflowNodeNameToIdMap : Record<string, number> = {}
let workflowExecutionNodeIdToNameMap: Record<number, string> = {}
let workflowNodeId = -1

function setNodeId(name: string, id: number) {
    workflowNodeNameToIdMap[name] = id
}

function genNodeId(name: string) : number {
    if (name in workflowNodeNameToIdMap) {
        throw `node ${name} already defined`
    }

    workflowNodeNameToIdMap[name] = ++workflowNodeId
    workflowExecutionNodeIdToNameMap[workflowNodeId] = name
    return workflowNodeId
}

function getNodeId(name: string) : number {
    if (name in workflowNodeNameToIdMap) {
        return workflowNodeNameToIdMap[name]
    }

    throw `node ${name} not defined`
}

type customWorkflowFunc = (...params: any[]) => any;

function resolveTillWorkflowComponent(element: React.ReactElement) : React.ReactElement{
    while(true) {
        if (typeof element.type != 'function') {
            throw 'non functional component'
        }

        if (element.type == WorkflowComponent) {
            break
        }

        element = (element.type as customWorkflowFunc).call(null, element.props)
        if (typeof element != 'object') {
            throw 'non react element'
        }
    }
    
    return element
}

function buildSubWorkflow(element: React.ReactElement, prefix: string) : WorkflowNode[] {
    const props: WorkflowInputProps = element.props
    const children : React.ReactElement[] = element.props["children"]
    const workflowName: string = prefix + "." + props.name
    const outSideParams: string[] = props.params
    let nodes: WorkflowNode[] = []
    for (const child of children) {
        if (child.type == InputNodeComponent) {
            const childProps: InputNodeProps = child.props
            const params: string[] = childProps.params
            for (let inx = 0; inx < params.length; ++inx) {
                const depId = getNodeId(prefix + "." + outSideParams[inx])
                setNodeId(workflowName + "." + params[inx], depId)
            }
        } else if (child.type == OutputNodeComponent) {
            const childProps: OutputNodeProps = child.props
            const name: string = childProps.name
            const dep: string = childProps.dep
            const id = getNodeId(workflowName + "." + dep)
            setNodeId(workflowName + "." + name, id)
        } else if (child.type == NodeComponent) {
            const nodeProps: NodeProps = child.props
            const name: string = nodeProps.name
            const deps: string[] = nodeProps.deps
            const depIds: number[] = []
            if (deps && deps.length) {
                for (const dep of deps) {
                    const id = getNodeId(workflowName + "." + dep)
                    depIds.push(id)
                }
            }

            const id = genNodeId(workflowName + "." + name)
            nodes.push({
                id: id,
                deps: depIds,
                gen: nodeProps.gen
            })
        } else {
            const runElement: React.ReactElement = resolveTillWorkflowComponent(child)            
            nodes = nodes.concat(buildSubWorkflow(runElement, workflowName))
        }
    }

    return nodes
}

export function buildJsxWorkflow(elementDefinition: React.ReactElement, addNodeName: boolean = false) : Workflow{ // eslint-disable-line
    const element: React.ReactElement = resolveTillWorkflowComponent(elementDefinition)
    const props: WorkflowProps = element.props;
    const children : React.ReactElement[] = props.children
    const workflowName = ""
    const inputNodes: WorkflowNode[] =[]
    const outputs: Record<number, string> = {}
    let innerNodes: WorkflowNode[] = []
    for (const child of children) {
        if (child.type == InputNodeComponent) {
            const childProps: InputNodeProps = child.props
            const params: string[] = childProps.params
            for (const param of params) {
                const id = genNodeId(workflowName + "." + param)
                inputNodes.push({
                    id: id,
                    deps: [],
                    gen: unitNodeGenerator
                })
            }
        } else if (child.type == OutputNodeComponent) {
            const childProps: OutputNodeProps = child.props
            const name: string = childProps.name
            const dep: string = childProps.dep
            const id = getNodeId(workflowName + "." + dep)
            setNodeId(workflowName + "." + name, id)
            outputs[id] = name
        } else if (child.type == NodeComponent) {
            const childProps: NodeProps = child.props
            const name: string = childProps.name
            const deps: string[] = childProps.deps
            const depIds: number[] = []
            if (deps && deps.length) {
                for (const dep of deps) {
                    const id = getNodeId(workflowName + "." + dep)
                    depIds.push(id)
                }
            }

            const id = genNodeId(workflowName + "." + name)
            innerNodes.push({
                id: id,
                deps: depIds,
                gen: childProps.gen
            })
        } else {
            const runElement: React.ReactElement = resolveTillWorkflowComponent(child)
            innerNodes = innerNodes.concat(buildSubWorkflow(runElement, workflowName));
        }
    }

    workflowNodeNameToIdMap = {}
    workflowNodeId = -1
    const workflowBuilder: WorkflowBuilder = createWorkflowBuilder();
    workflowBuilder.input(inputNodes)
    .next(innerNodes)
    .output(outputs);

    if (addNodeName) {
        workflowBuilder.nodeNames(Object.assign({}, workflowExecutionNodeIdToNameMap))
    }

    workflowExecutionNodeIdToNameMap = {}
    return workflowBuilder.build()
}
