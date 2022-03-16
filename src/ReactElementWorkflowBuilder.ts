import React from "react";
import { Workflow } from "./Workflow";
import { createWorkflowBuilder, WorkflowBuilder } from "./WorkflowBuilder";
import { InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent } from "./WorkflowComponent";
import { unitNodeGenerator } from "./WorkflowInnerNode";
import { WorkflowNode } from "./WorkflowNode";
import {WorkflowProps, InputNodeProps, OutputNodeProps, NodeProps, WorkflowInputProps} from "./WorkflowComponent"

let workflowNodeNameToIdMap : Record<string, number> = {}
let workflowNodeId = -1

function setNodeId(name: string, id: number) {
    workflowNodeNameToIdMap[name] = id
}

function genNodeId(name: string) : number {
    if (name in workflowNodeNameToIdMap) {
        return -1
    }

    workflowNodeNameToIdMap[name] = ++workflowNodeId
    return workflowNodeId
}

function getNodeId(name: string) : number {
    if (name in workflowNodeNameToIdMap) {
        return workflowNodeNameToIdMap[name]
    }

    return -1
}

type customWorkflowFunc = (...params: any[]) => any;

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
                const id = genNodeId(workflowName + "." + params[inx])
                if (id < 0) {
                    throw "duplicate node name found " + workflowName + "." + params[inx]
                }

                const depId = getNodeId(prefix + "." + outSideParams[inx])
                if (depId < 0) {
                    throw "dependency must be defined before it's used"
                }

                nodes.push({
                    id: id,
                    deps: [depId],
                    gen: unitNodeGenerator
                })
            }
        } else if (child.type == OutputNodeComponent) {
            const childProps: OutputNodeProps = child.props
            const name: string = childProps.name
            const dep: string = childProps.dep
            const id = getNodeId(workflowName + "." + dep)
            if (id < 0) {
                throw "dependency must be defined before it's used"
            }

            setNodeId(workflowName + "." + name, id)
        } else if (child.type == NodeComponent) {
            const nodeProps: NodeProps = child.props
            const name: string = nodeProps.name
            const deps: string[] = nodeProps.deps
            const depIds: number[] = []
            if (deps && deps.length) {
                for (const dep of deps) {
                    const id = getNodeId(workflowName + "." + dep)
                    if (id < 0) {
                        throw "dependency must be defined before it's used"
                    }

                    depIds.push(id)
                }
            }

            const id = genNodeId(workflowName + "." + name)
            if (id < 0) {
                throw "duplicate node name found " + workflowName + "." + name
            }

            nodes.push({
                id: id,
                deps: depIds,
                gen: nodeProps.gen
            })
        } else {
            let runElement: React.ReactElement = child
            while(runElement.type != WorkflowComponent) {
                runElement = (runElement.type as customWorkflowFunc).call(null, child.props)
            }
            
            nodes = nodes.concat(buildSubWorkflow(runElement, workflowName))
        }
    }

    return nodes
}

export function buildJsxWorkflow(elementDefinition: React.ReactElement) : Workflow{
    let element: React.ReactElement = elementDefinition
    while (element.type != WorkflowComponent) {
        element = (element.type as customWorkflowFunc).call(null)
    }

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
                if (id < 0) {
                    throw "duplicate node name found " + workflowName + "." + param
                }

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
            if (id < 0) {
                throw "dependency must be defined before it's used"
            }

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
                    if (id < 0) {
                        throw "dependency must be defined before it's used"
                    }

                    depIds.push(id)
                }
            }

            const id = genNodeId(workflowName + "." + name)
            if (id < 0) {
                throw "duplicate node name found " + workflowName + "." + name
            }

            innerNodes.push({
                id: id,
                deps: depIds,
                gen: childProps.gen
            })
        } else {
            let runElement: React.ReactElement = child
            while(runElement.type != WorkflowComponent) {
                runElement = (runElement.type as customWorkflowFunc).call(null, child.props)
            }

            innerNodes = innerNodes.concat(buildSubWorkflow(runElement, workflowName));
        }
    }

    workflowNodeNameToIdMap = {}
    workflowNodeId = -1
    const workflowBuilder: WorkflowBuilder = createWorkflowBuilder();
    workflowBuilder.input(inputNodes)
    .next(innerNodes)
    .output(outputs);

    return workflowBuilder.build()
}
