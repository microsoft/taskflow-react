# React and promise based task flow library
Now a lot of features are task flow based. You could break features into a seriese of tasks with order and dependency. For example, to start task C, you have to wait for task A / B and then take their outputs for further process. To express and reuse task flow easily, it could help improve development efficiency. We would refer task flow as Workflow in code.

## Example
Take the task flow below, there are 4 params for input. The task flow would add all 4 params with 3 add nodes and then double the sum with double node. Then the double node's result would be set as task flow's output.

![SampleTaskFlow](./md/SampleTaskFlow.png)

The task flow above could be expressed with react jsx style below,
```typescript
<WorkflowComponent>
    <InputNodeComponent params={["num1", "num2", "num3", "num4"]} />
    <NodeComponent name="add1" gen={addFunc} deps={["num1", "num2"]} />
    <NodeComponent name="add2" gen={addFunc} deps={["num3", "num4"]} />
    <NodeComponent name="add3" gen={addFunc} deps={["add1", "add2"]} />
    <NodeComponent name="double" gen={doubleFunc} deps={["add3"]} />
    <OutputNodeComponent name="res" dep="double" />
</WorkflowComponent>
```
As you could tell from the code above, there is a container tag *WorkflowComponent*. Inside the container, there is first a *InputNodeComponent* node with *params* which is a array of name of the input parameters. *NodeComponent* add1 would take num1 and num2 defined within *InputNodeComponent* node to compute the add result with addFunc. After two node add1 and add2 finish work, add3 would take their outputs to run addFunc again with result passed to double node. Finally the result of double node computed by doubleFunc, would be set as task flow's output with alias res.

If you want to define a re-usable task flow, then you could define a function with props to wrap the workflow.
```typescript
function ComputationWorkflow(props: WorkflowInputProps) {
    return (<WorkflowComponent {...props}>
            <InputNodeComponent params={["num1", "num2", "num3", "num4"]} />
            <NodeComponent name="add1" gen={addFunc} deps={["num1", "num2"]} />
            <NodeComponent name="add2" gen={addFunc} deps={["num3", "num4"]} />
            <NodeComponent name="add3" gen={addFunc} deps={["add1", "add2"]} />
            <NodeComponent name="double" gen={doubleFunc} deps={["add3"]} />
            <OutputNodeComponent name="res" dep="double" />
        </WorkflowComponent>
    )
}
```
And in a new task flow, reuse the task flow by passsing the params. Then chain the current task flow output to parent taks flow's output node.
```typescript
<WorkflowComponent>
    <InputNodeComponent params={["num1", "num2", "num3", "num4"]} />
    <ComputationWorkflow name="comp" params={["num1", "num2", "num3", "num4"]} />
    <OutputNodeComponent name="res" dep="comp.res" />
</WorkflowComponent>

```
Once you have defined jsx task flow, you could use buildJsxWorkflow to generate the task flow data structure. And with createWorkflowExecutor, then you could run workflow with the executor. Please reference example and test folder for more.

## Development Setup
Please install vscode as IDE
```ini
# install
npm install

# build
npm run build

# test
npm run test

# lint
npm run lint
```
To debug test case, set sourceMap to be true in tsconfig.json, set configuration to be Jest Current File, open test file and run Start Debugging from vscode menu.
