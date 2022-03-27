import { FreState } from "../views/FrePage";
import { freController } from "./FreController";
import {WorkflowExecutionNode, WorkflowComponent, NodeComponent, buildJsxWorkflow, createWorkflowExecutor} from "taskflow-react"
import React from "react";

function firstPageNode() : WorkflowExecutionNode{
    return {
        run() {
            return new Promise((resolve, reject) => {
                freController.firstPageResolver = resolve
            })
        },
        cancel() {
            freController.firstPageResolver(undefined)
        }
    }
}

function secondPageNode() : WorkflowExecutionNode {
    return {
        run() {
            return new Promise((resolve, reject) => {
                freController.secondPageResolver = resolve
            })
        },
        cancel() {
            freController.secondPageResolver(undefined)
        }
    }
}

function thirdPageNode() : WorkflowExecutionNode {
    return {
        run() {
            return new Promise((resolve, reject) => {
                freController.thirdPageResolver = resolve
            })
        },
        cancel() {
            freController.thirdPageResolver(undefined)
        }
    }
}

function showLoadingNode() : WorkflowExecutionNode {
    return {
        run() {
            freController.setShowLoading(true)
            return true
        }
    }
}

function hideLoadingNode() : WorkflowExecutionNode {
    return {
        run() {
            freController.setShowLoading(false)
            return true;
        }
    }
}

function savePage1Node() : WorkflowExecutionNode {
    return {
        run(sel: string[]) {
            return new Promise<FreState>((resolve, reject) => {
                setTimeout(() => {
                    if (sel.length > 2) {
                        resolve(FreState.Second_1)
                    }
                    else {
                        resolve(FreState.Second_2)
                    }
                }, 2000)
            })
        }
    }
}

function savePage2Node() : WorkflowExecutionNode {
    return {
        run(sel: string[]) {
            return new Promise<FreState>((resolve, reject) => {
                setTimeout(() => {
                    if (sel.length > 2) {
                        resolve(FreState.Third_1)
                    }
                    else {
                        resolve(FreState.Third_2)
                    }
                }, 2000)
            })
        }
    }
}

function savePage3Node() : WorkflowExecutionNode {
    return {
        run(sel: string[]) {
            return new Promise<boolean>((resolve, reject) => {
                setTimeout(() => {
                    resolve(true)
                }, 2000)
            })
        }
    }
}

function showBusinessPage() : WorkflowExecutionNode {
    return {
        run() {
            freController.setFreDone(true)
        }
    }
}

function forwardPageNode() : WorkflowExecutionNode {
    return {
        run(state: FreState) {
            freController.setStage(state)
            return true
        }
    }
}

export function createWorkflow() {
    return <WorkflowComponent>
        <NodeComponent name="firstPage" gen={firstPageNode} />
        <NodeComponent name="showFirstPageLoading" gen={showLoadingNode} deps={["firstPage"]} />
        <NodeComponent name="saveFirstPage" gen={savePage1Node} deps={["firstPage"]} />
        <NodeComponent name="hideFirstPageLoading" gen={hideLoadingNode} deps={["saveFirstPage"]} />
        <NodeComponent name="forwardToSecondPage" gen={forwardPageNode} deps={["saveFirstPage"]} />

        <NodeComponent name="secondPage" gen={secondPageNode} deps={["forwardToSecondPage"]} />
        <NodeComponent name="showSecondPageLoading" gen={showLoadingNode} deps={["secondPage"]} />
        <NodeComponent name="saveSecondPage" gen={savePage2Node} deps={["secondPage"]} />
        <NodeComponent name="hideSecondPageLoading" gen={hideLoadingNode} deps={["saveSecondPage"]} />
        <NodeComponent name="forwardToThirdPage" gen={forwardPageNode} deps={["saveSecondPage"]} />

        <NodeComponent name="thirdPage" gen={thirdPageNode} deps={["forwardToThirdPage"]} />
        <NodeComponent name="showthirdPageLoading" gen={showLoadingNode} deps={["thirdPage"]} />
        <NodeComponent name="saveThirdPage" gen={savePage3Node} deps={["thirdPage"]} />
        <NodeComponent name="showBusinessPage" gen={showBusinessPage} deps={["saveThirdPage"]} />
    </WorkflowComponent>
}

const workflow = buildJsxWorkflow(createWorkflow());
export const workflowExecutor = createWorkflowExecutor(workflow);