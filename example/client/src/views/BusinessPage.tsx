import { useState } from "react"
import React from "react";
import { computationWorkflowExecutor } from "../controller/ComputationWorkflow"

export function BusinessPage() {
    let [resultHint, setResultHint] = useState("")
    let [running, setRunning] = useState(false)
    function runResult() {
        if (running) {
            return;
        }

        setResultHint("Running for result")
        computationWorkflowExecutor.reset()
        setRunning(true)
        computationWorkflowExecutor.run(1, 3, 5).then((result) => {
            setResultHint("Get result " + result["output"])
            setRunning(false)
        })
    }

    return <div>
        <h1>This is business page.</h1>
        { resultHint ? <h2>{resultHint}</h2> : null}
        <div onClick={runResult} className={"next buttontext"}>Run Result</div>
    </div>
}
