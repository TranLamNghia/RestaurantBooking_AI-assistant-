from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory

class ContextManager:
    """
    Manage conversation memory (Memory/Session) for users.
    Currently using in-memory dictionary. 
    In the future, it can be extended to save into Redis/MySQL.
    """
    def __init__(self):
        self._session_memories = {}

    def get_session_history(self, session_id: str) -> BaseChatMessageHistory:
        """
        Get the ChatMessageHistory object by session_id.
        """
        if session_id not in self._session_memories:
            self._session_memories[session_id] = ChatMessageHistory()
        return self._session_memories[session_id]

    def clear_session(self, session_id: str):
        """Clear the conversation history of a session."""
        if session_id in self._session_memories:
            self._session_memories[session_id].clear()

# Singleton instance for the application
context_manager = ContextManager()
