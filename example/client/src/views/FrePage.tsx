import { useState } from "react";
import { freController } from "../controller/FreController";
import { CancelView } from "./CancelView";
import { FirstPage } from "./FirstPage";
import { LoadingPage } from "./LoadingPage";
import { SecondPage } from "./SecondPage";
import { ThirdPage } from "./ThirdPage";

export enum FreState {
    First,
    Second_1,
    Second_2,
    Third_1,
    Third_2,
}

export function FrePage() {
    let [stage, setStage] = useState(FreState.First)
    let [showLoading, setShowLoading] = useState(false)
    freController.setStage = setStage
    freController.setShowLoading = setShowLoading
    let freView = null;
    switch(stage) {
        case FreState.Second_1:
            freView = <SecondPage state={1}/>
            break;
        case FreState.Second_2:
            freView = <SecondPage state={2} />
            break;
        case FreState.Third_1:
            freView = <ThirdPage state={1} />
            break;
        case FreState.Third_2:
            freView = <ThirdPage state={2} />
            break;
        default:
            freView = <FirstPage />
    }

    return <>
    <CancelView />
    {freView}
    {showLoading ? <LoadingPage /> : null }
    </>;
}
