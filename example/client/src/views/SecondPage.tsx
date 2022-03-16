import { useState } from "react"
import { freController } from "../controller/FreController"
import { PageProps } from "./PageProps"

export function SecondPage(props: PageProps) {
    let options = ['New York', 'Beijing', 'Hongkong', 'Moscow', 'Sydney', 'Paris', 'London']
    let [pendingNext, setPendingNext] = useState(false)
    let [selectState, setSelectState] = useState<boolean[]>(Array.from({length: options.length}, () => false))
    function selectOption(index: number) {
        return () => {
            if (pendingNext) {
                return
            }

            let newState: boolean[] = selectState.concat([])
            newState[index] = !newState[index]
            setSelectState(newState)
        }
    }

    function pageNext() {
        if (pendingNext) {
            return
        }

        setPendingNext(true)
        let selectedText: string[] = []
        for (let inx = 0; inx < selectState.length; ++inx) {
            if (selectState[inx]) {
                selectedText.push(options[inx])
            }
        }

        freController.secondPageResolver(selectedText)
    }

    let nextClassName = "next buttontext"
    if (pendingNext) {
        nextClassName += " selected"
    }

    return  <div className="firstpage">
        <h2>Second Page {props.state}</h2>
        <div className="optionlist">
            {
                options.map((value, index) => {
                    let className = "option buttontext"
                    if (selectState[index]) {
                        className += " selected"
                    }

                    return <div className={className} onClick={selectOption(index)} key={index}>{value}</div>
                })
            }
        </div>
        <div className={nextClassName} onClick={pageNext}>Next</div>
    </div>
}
