import { Workflow } from "./Workflow";
import { WorkflowRunTimeNode } from "./WorkflowInnerNode";

export enum ExecutionStatus {
    NotStarted = 0,
    Running = 1,
    Cancelled = 2,
    Failure = 3,
    Done = 4,
}

export interface NodeExecutionStatus {
    status: ExecutionStatus;
    id: number;
    start: number;
    end: number;
    name?: string;
}

export interface WorkflowExecutor {
    cancel() : void;
    run(...params: any[]) : Promise<any>;
    setTimeout(timeout: number) : void;
    reset() : void;
    state() : ExecutionStatus;
    inst(inst: boolean) : void;
    workflow() : Workflow;
    stats(): NodeExecutionStatus[];
}

export function createWorkflowExecutor(wf: Workflow) {
    const workflow: Workflow = wf;
    let executorTimeout = 0;
    let status: ExecutionStatus = ExecutionStatus.NotStarted;
    let intermediateResults: Record<number, Record<number, any>> = {}
    let output: Record<string, any> = {}
    let runningNodes: WorkflowRunTimeNode[] = [];
    let pendingPromises: Promise<any>[] = []
    function update(id: number, oriResult: any) : WorkflowRunTimeNode[] {
        updateNodeExecutionStatus(id, ExecutionStatus.Done)
        if (typeof oriResult === 'undefined') {
            return []
        }

        let result = oriResult
        if (typeof oriResult === 'object') {
            result = Object.freeze(result)
        }

        if (id in workflow.outputs) {
            output[workflow.outputs[id]] = result
        }

        const newNodesToRun: WorkflowRunTimeNode[] = []
        const outbindings = workflow.binding[id]
        if (outbindings && outbindings.length) {
            for (const outbinding of outbindings) {
                if (!(outbinding in intermediateResults)) {
                    intermediateResults[outbinding] = {}
                }

                intermediateResults[outbinding][id] = result
                const targetNode = workflow.nodes[outbinding]
                if (Object.keys(intermediateResults[outbinding]).length == targetNode.deps.length) {
                    const inputs: any[] = []
                    for (const dep of targetNode.deps) {
                        inputs.push(intermediateResults[outbinding][dep])
                    }

                    const newNodeToRun: WorkflowRunTimeNode = {
                        node: targetNode.gen(),
                        id: targetNode.id,
                        inputs: inputs,
                    }

                    // remove intermediate states of ready node
                    delete intermediateResults[outbinding]
                    newNodesToRun.push(newNodeToRun)
                }
            }
        }

        return newNodesToRun
    }

    let enableInst = false
    let nodeExecutionStatus: NodeExecutionStatus[] = []
    function updateNodeExecutionStatus(id: number, status: ExecutionStatus) {
        if (enableInst) {
            if (status == ExecutionStatus.Running) {
                nodeExecutionStatus.push({
                    id: id,
                    start: new Date().getTime(),
                    end: 0,
                    status: status,
                    name: workflow.nodeNames ? ((id in workflow.nodeNames) ? workflow.nodeNames[id] : undefined) : undefined
                })
            } else {
                // search from last one
                for (let inx = nodeExecutionStatus.length - 1; inx >= 0; inx--) {
                    if (nodeExecutionStatus[inx].id == id) {
                        nodeExecutionStatus[inx].status = status
                        nodeExecutionStatus[inx].end = new Date().getTime()
                        break
                    }
                }
            }
        }
    }

    const executor: WorkflowExecutor = {
        state() : ExecutionStatus {
            return status
        },

        inst(inst: boolean) : void {
            enableInst = inst
        },

        stats() : NodeExecutionStatus[] {
            return nodeExecutionStatus
        },

        workflow() : Workflow {
            return wf
        },

        reset() : void {
            status = ExecutionStatus.NotStarted;
            intermediateResults = {}
            output = {}
            runningNodes = [];
            pendingPromises = []
            nodeExecutionStatus = []
        },

        setTimeout(timeout: number) : void {
            executorTimeout = timeout
        },

        cancel() : void {
            if (status != ExecutionStatus.Running) {
                return;
            }

            status = ExecutionStatus.Cancelled
            for (const node of runningNodes) {
                if (node.node.cancel) {
                    updateNodeExecutionStatus(node.id, ExecutionStatus.Cancelled)
                    node.node.cancel()
                }
            }
        },
    
        async run(...params: any[]) {
            if (executorTimeout > 0) {
                setTimeout(() => {
                    if (status == ExecutionStatus.Running) {
                        executor.cancel()
                    }
                }, executorTimeout)
            }

            status = ExecutionStatus.Running
            const nodesToRun: WorkflowRunTimeNode[] = [];
            for (let inx = 0; inx < params.length; ++inx) {
                nodesToRun.push({
                    node: workflow.nodes[workflow.inputs[inx]].gen(),
                    id: workflow.inputs[inx],
                    inputs: [params[inx]],
                })
            }
    
            for (const nodeId of workflow.zeroDepNodes) {
                nodesToRun.push({
                    node: workflow.nodes[nodeId].gen(),
                    id: nodeId,
                    inputs: []
                })
            } 

            function executeParallalNodes(nodesToRun: WorkflowRunTimeNode[]) : Promise<boolean>{
                return new Promise<boolean>(async(resolve, reject) => {
                    while(nodesToRun.length) {
                        const node: WorkflowRunTimeNode = nodesToRun.pop()!
                        let result = undefined
                        try{
                            updateNodeExecutionStatus(node.id, ExecutionStatus.Running)
                            result = node.node.run(...node.inputs)
                        }
                        catch(err) {
                            executor.cancel()
                            status = ExecutionStatus.Failure
                            updateNodeExecutionStatus(node.id, ExecutionStatus.Failure)
                            result = undefined
                            break
                        }
    
                        if (result instanceof Promise) {
                            runningNodes.push(node)
                            const pendingResult : Promise<void> = result.then(async (value) => {
                                if (status != ExecutionStatus.Running) {
                                    return;
                                }
    
                                const inx = runningNodes.indexOf(node)
                                if (inx >= 0) {
                                    runningNodes.splice(inx, 1)
                                }
    
                                const newNodes = update.call(executor, node.id, value)
                                if (newNodes.length) {
                                    pendingPromises.push(executeParallalNodes(newNodes))
                                }
                            })
                            .catch(() => {
                                executor.cancel()
                                status = ExecutionStatus.Failure
                                updateNodeExecutionStatus(node.id, ExecutionStatus.Failure)
                                result = undefined
                            })
    
                            pendingPromises.push(pendingResult)
                        }
                        else{
                            const newNodes = update.call(executor, node.id, result)
                            nodesToRun = nodesToRun.concat(newNodes)
                        }
                    }
    
                    while(pendingPromises.length > 0) {
                        const promisesToWait = pendingPromises.splice(0, pendingPromises.length)
                        await Promise.all(promisesToWait)
                    }
    
                    resolve(true)
                })
            }
    
            await executeParallalNodes(nodesToRun)
            if (status == ExecutionStatus.Running) {
                if (Object.keys(workflow.outputs).length == Object.keys(output).length) {
                    status = ExecutionStatus.Done
                }
                else {
                    status = ExecutionStatus.Failure
                }
            }
    
            return output
        }        
    }

    return executor
}
