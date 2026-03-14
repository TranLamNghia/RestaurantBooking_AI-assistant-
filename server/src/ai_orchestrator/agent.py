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
    Hàm điều phối vòng lặp (Reasoning Loop) chính của AI Agent sử dụng LangGraph.
    """
    # 1. Khởi tạo LLM Gemini
    llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.7)
    
    # 2. Lấy danh sách Tools từ Registry
    tools = ToolRegistry.get_tools(db)
    
    # 3. Tạo Agent bằng LangGraph (thay thế cho AgentExecutor cũ bị deprecated)
    agent_executor = create_react_agent(
        model=llm,
        tools=tools,
        prompt=SYSTEM_PROMPT,
        checkpointer=memory
    )
    
    try:
        # 4. Thực thi reasoning loop
        response = await agent_executor.ainvoke(
            {"messages": [("user", message)]},
            config={"configurable": {"thread_id": session_id}}
        )
        
        # 5. Parse / Format dữ liệu đầu ra từ tin nhắn AI cuối cùng
        last_message = response["messages"][-1].content
        final_reply = ChatParser.parse_response(last_message)
        
        return final_reply
        
    except Exception as e:
        print(f"[AI AGENT ERROR] {str(e)}")
        return "Xin lỗi anh/chị, hệ thống AI của em đang gặp chút gián đoạn. Anh/chị vui lòng thử lại sau giây lát ạ!"
