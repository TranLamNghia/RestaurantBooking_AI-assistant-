import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.runnables.history import RunnableWithMessageHistory
from sqlalchemy.orm import Session

# Import modular components
from src.ai_orchestrator.prompts import get_agent_prompt
from src.ai_orchestrator.tool_registry import ToolRegistry
from src.ai_orchestrator.context_manager import context_manager
from src.ai_orchestrator.parser import ChatParser

async def handle_user_message(db: Session, session_id: str, message: str) -> str:
    """
    Hàm điều phối vòng lặp (Reasoning Loop) chính của AI Agent.
    """
    # 1. Khởi tạo LLM Gemini
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
    
    # 2. Lấy danh sách Tools từ Registry
    tools = ToolRegistry.get_tools(db)
    
    # 3. Lấy Prompt Template
    prompt = get_agent_prompt()
    
    # 4. Tạo Agent & Executor (Loop orchestration) sử dụng tool calling chuẩn
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    # 5. Gắn Memory (Context Manager) vào Agent
    agent_with_chat_history = RunnableWithMessageHistory(
        agent_executor,
        context_manager.get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
    )
    
    try:
        # Thực thi reasoning loop
        response = await agent_with_chat_history.ainvoke(
            {"input": message},
            config={"configurable": {"session_id": session_id}}
        )
        
        # 6. Parse / Format dữ liệu đầu ra
        final_reply = ChatParser.parse_response(response["output"])
        return final_reply
        
    except Exception as e:
        print(f"[AI AGENT ERROR] {str(e)}")
        return "Sorry, the AI system is currently experiencing some issues. Please try again later!"
