import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from sqlalchemy.orm import Session

# Import modular components
from src.ai_orchestrator.prompts import SYSTEM_PROMPT
from src.ai_orchestrator.tool_registry import ToolRegistry
from src.ai_orchestrator.parser import ChatParser

# Global memory saver for LangGraph checkpointer
memory = MemorySaver()

async def handle_user_message(db: Session, session_id: str, message: str) -> str:
    """
    The main function of AI Agent using LangGraph.
    """
    # 1. Initialize LLM Gemini with multiple API Key configuration (Fallbacks/Rotation)
    api_keys_str = os.getenv("GEMINI_API_KEY", "")
    api_keys = [k.strip() for k in api_keys_str.split(",") if k.strip()]
    
    if api_keys:
        # Get the first key as the main key
        llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.7, google_api_key=api_keys[0])
        
        # If there are 2 or more keys, configure fallback keys
        if len(api_keys) > 1:
            fallbacks = [
                ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.7, google_api_key=key)
                for key in api_keys[1:]
            ]
            llm = llm.with_fallbacks(fallbacks)
            print(f"[AI ORCHESTRATOR] Successfully initialized {len(api_keys)} fallback API Keys.")
    else:
        # Fallback in case the environment variable is missing but the cloud environment still has a hidden key
        llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.7)
    # 2. Get tools from Registry
    tools = ToolRegistry.get_tools(db)
    
    # 3. Create Agent using LangGraph (replace the old deprecated AgentExecutor)
    agent_executor = create_react_agent(
        model=llm,
        tools=tools,
        prompt=SYSTEM_PROMPT,
        checkpointer=memory
    )
    
    try:
        # 4. Execute reasoning loop
        response = await agent_executor.ainvoke(
            {"messages": [("user", message)]},
            config={"configurable": {"thread_id": session_id}}
        )
        
        # 5. Parse / Format output data from the last AI message
        last_message = response["messages"][-1].content
        final_reply = ChatParser.parse_response(last_message)
        
        return final_reply
        
    except Exception as e:
        print(f"[AI AGENT ERROR] {str(e)}")
        return "Sorry, the AI system is currently experiencing some issues. Please try again later!"
