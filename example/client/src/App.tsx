import { useEffect, useState } from "react"
import "./App.css"
import { freController } from "./controller/FreController"
import { workflowExecutor } from "./controller/FreWorkflow"
import { BusinessPage } from "./views/BusinessPage"
import { FrePage } from "./views/FrePage"
import React from "react";

export function App() {
  let [freDone, setFreDone] = useState(false)
  freController.setFreDone = setFreDone
  useEffect(() => {
    workflowExecutor.run()
  }, [])
  if (freDone) {
    return <BusinessPage />
  }

  return <FrePage />
}
