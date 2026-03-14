from typing import Union, List, Dict

class ChatParser:
    """
    Standardize output data from AI (LLM Output Parsing).
    Since LangChain AgentExecutor automatically parses the final string result,
    this class can be used to parse custom data structures (e.g., JSON, XML)
    if the AI needs to return raw data for the Frontend to process instead of text.
    """
    @staticmethod
    def parse_response(raw_output: Union[str, List[Union[str, Dict]]]) -> str:
        """
        Clean up or format the text before returning to the user.
        Handles cases where Gemini returns structured content as a list.
        """
        if isinstance(raw_output, list):
            text_blocks = []
            for block in raw_output:
                if isinstance(block, str):
                    text_blocks.append(block)
                elif isinstance(block, dict) and "text" in block:
                    text_blocks.append(block["text"])
            parsed_output = "".join(text_blocks).strip()
        else:
            parsed_output = str(raw_output).strip()
            
        return parsed_output
