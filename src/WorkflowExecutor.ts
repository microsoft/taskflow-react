import { Workflow } from "./Workflow";
import { WorkflowRunTimeNode } from "./WorkflowInnerNode";

export enum ExecutionStatus {
    NotStarted = 0,
    Running = 1,
    Cancelled = 2,
    Failure = 3,
    Done = 4,
}

export interface WorkflowExecutor {
    cancel() : void;
    run(...params: any[]) : Promise<any>;
    setTimeout(timeout: number) : void;
    reset() : void;
    state() : ExecutionStatus;
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

    const executor: WorkflowExecutor = {
        state() : ExecutionStatus {
            return status
        },

        reset() : void {
            status = ExecutionStatus.NotStarted;
            intermediateResults = {}
            output = {}
            runningNodes = [];
            pendingPromises = []
        },

        setTimeout(timeout: number) : void {
            executorTimeout = timeout
        },

        cancel() : void {
            status = ExecutionStatus.Cancelled
            for (const node of runningNodes) {
                if (node.node.cancel) {
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
                            result = node.node.run(...node.inputs)
                        }
                        catch(err) {
                            status = ExecutionStatus.Failure
                            executor.cancel()
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
                                status = ExecutionStatus.Failure
                                executor.cancel()
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
