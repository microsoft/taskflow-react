import { freController } from "../controller/FreController"
import { workflowExecutor } from "../controller/FreWorkflow"

export function CancelView() {
    function cancel() {
        workflowExecutor.cancel()
        freController.setFreDone(true)
    }

    return <div className={"cancel buttontext"} onClick={cancel}>Cancel</div>
}
