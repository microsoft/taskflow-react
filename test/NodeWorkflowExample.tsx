import { NodeComponent, WorkflowInputProps, WorkflowComponent, InputNodeComponent, OutputNodeComponent } from "../src/WorkflowComponent"
import React from "react";

export function asyncAdd() {
    return {
        run(num1: number, num2: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num1 + num2)
                }, 2000)
            })
        }
    }
}

export function asyncDouble() {
    return {
        run(num: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num * 2)
                }, 2000)
            })
        }
    }
}

export function add() {
    return {
        run(num1: number, num2: number) {
            return num1 + num2;
        }
    }
}

export function double() {
    return {
        run(num: number) {
            return num * 2;
        }
    }
}

export function AddWithDoubleWorkflow(props: WorkflowInputProps) {
    return <WorkflowComponent {...props}>
        <InputNodeComponent params={["num1", "num2"]} />
        <DoubleWorkflow params={["num2"]} name="double" />
        <NodeComponent name="add" gen={add} deps={["num1", "double.output"]} />
        <OutputNodeComponent name="output" dep="add" />
    </WorkflowComponent>
}

export function DoubleWorkflow(props: WorkflowInputProps) {
    return <WorkflowComponent {...props}>
        <InputNodeComponent params={["num"]} />
        <NodeComponent name="double" gen={double} deps={["num"]} />
        <OutputNodeComponent name="output" dep="double" />
    </WorkflowComponent>
}

export function ComputationWorkflow(props: WorkflowInputProps) {
    return (<WorkflowComponent {...props}>
        <InputNodeComponent params={["num1", "num2", "num3"]} />
        <NodeComponent gen={add} deps={["num1", "num2"]} name="add" />
        <NodeComponent gen={double} deps={["num3"]} name="double" />
        <NodeComponent gen={add} deps={["add", "double"]} name="finalAdd" />
        <OutputNodeComponent name="res" dep="finalAdd" />
    </WorkflowComponent>)
}

export let WorkflowToTest = <ComputationWorkflow />