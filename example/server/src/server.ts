import express, { Request, Express, Response } from 'express'
import { createWorkflowExecutor } from 'taskflow-react'
import {workflow} from "./workflow"

function handleRequest(req: Request, res: Response) {
    const workflowExecutor = createWorkflowExecutor(workflow)
    const ret = workflowExecutor.run(1, 2, 3)
    ret.then((value) => {
        res.json(value)
    })
}

const app : Express = express()
app.get("*", handleRequest)
app.listen(3000)
console.log('Listening localhost port 3000')
