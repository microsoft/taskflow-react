import React from 'react'
import {buildJsxWorkflow, InputNodeCompoent, NodeComponent, OutputNodeComponent, WorkflowCompoent} from 'taskflow-react'

function add() {
    return {
        run(num1, num2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(num1 + num2)
                }, 2000)
            })
        }
    }
}

function double() {
    return {
        run(num) {
            return num * 2
        }
    }
}

const workflowJsx = (<WorkflowCompoent>
    <InputNodeCompoent params={["num1", "num2", "num3"]} />
    <NodeComponent name='add' gen={add} deps={["num1", "num2"]}/>
    <NodeComponent name='double' gen={double} deps={['num3']} />
    <NodeComponent name='finalAdd' gen={add} deps={["add", "double"]}/>
    <OutputNodeComponent name='res' dep='finalAdd' />
</WorkflowCompoent>)

export const workflow = buildJsxWorkflow(workflowJsx)