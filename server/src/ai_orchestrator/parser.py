class ChatParser:
    """
    Standardize output data from AI (LLM Output Parsing).
    Since LangChain AgentExecutor automatically parses the final string result,
    this class can be used to parse custom data structures (e.g., JSON, XML)
    if the AI needs to return raw data for the Frontend to process instead of text.
    """
    @staticmethod
    def parse_response(raw_output: str) -> str:
        """
        Clean up or format the text before returning to the user.
        """
        # (Optional) Perform custom parsing here
        parsed_output = raw_output.strip()
        return parsed_output
