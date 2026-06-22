import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue,  StateGraph, START, END } from "@langchain/langgraph";
import  type { GraphNode } from "@langchain/langgraph";




const state =  new StateSchema({
  message: MessagesValue,
})

const solutionNode: GraphNode<typeof state> = (state) => {
  console.log(state.message);

  return {
    message: state.message,
  };
};

const graph = new StateGraph(state)
.addNode("solution" , solutionNode)
.addEdge(START , "solution")
.compile();


export default async function(userMessage:string) {
  const result = await graph.invoke({
    message:[
      new HumanMessage(userMessage)
    ]
  })
  return result.message
}
