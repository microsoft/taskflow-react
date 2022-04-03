import React from 'react'
import {buildJsxWorkflow, InputNodeComponent, NodeComponent, OutputNodeComponent, WorkflowComponent} from 'taskflow-react'

function add() {
    return {
        run(num1 : number, num2 : number) {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num1 + num2)
                }, 2000)
            })
        }
    }
}

function double() {
    return {
        run(num: number) {
            return num * 2
        }
    }
}

const workflowJsx = (<WorkflowComponent>
    <InputNodeComponent params={["num1", "num2", "num3"]} />
    <NodeComponent name='add' gen={add} deps={["num1", "num2"]}/>
    <NodeComponent name='double' gen={double} deps={['num3']} />
    <NodeComponent name='finalAdd' gen={add} deps={["add", "double"]}/>
    <OutputNodeComponent name='res' dep='finalAdd' />
</WorkflowComponent>)

export const workflow = buildJsxWorkflow(workflowJsx)