# Tầng này điều phối AI, định nghĩa tools, gọi OpenAI/LLM và parse kết quả
import json
from src.services.booking_service import check_availability, book_table

# Giả lập một hàm gọi AI (LLM) đơn giản
async def handle_user_message(user_id: str, message: str) -> str:
    """
    Nhận tin nhắn, gửi cho LLM kèm theo mô tả của các tools.
    Tuỳ ngữ cảnh, LLM sẽ quyết định gọi hàm (ví dụ check_availability) hoặc trả lời text.
    """
    
    # 1. System Prompt mô tả nhà hàng, phong cách nói chuyện
    system_prompt = "Bạn là AI Concierge của nhà hàng Spice of Life..."
    
    # 2. Định nghĩa các tools cho AI biết nó có quyền làm gì
    tools = [
        {
            "type": "function",
            "function": {
                "name": "check_availability",
                "description": "Kiểm tra xem nhà hàng có còn bàn trống vào thời gian và số lượng khách được yêu cầu hay không.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "time": {"type": "string", "description": "Thời gian (VD: '19:00')"},
                        "guests": {"type": "integer", "description": "Số lượng khách"}
                    },
                    "required": ["time", "guests"]
                }
            }
        }
    ]
    
    # Ở đây thường sẽ dùng client của OpenAI: openai.chat.completions.create(...)
    # Giả lập logic AI trả về yêu cầu gọi hàm:
    is_asking_for_booking = "đặt bàn" in message.lower() or "bàn trống" in message.lower()
    
    if is_asking_for_booking:
        # Giả sử AI bóc tách được params từ lời nói của khách: 19:00, 2 khách
        print("[AI Orchestrator] LLM yêu cầu gọi tool 'check_availability'")
        extracted_time = "19:00"
        extracted_guests = 2
        
        # 3. AI Orchestrator gọi xuống tầng Service
        is_available = await check_availability(extracted_time, extracted_guests)
        
        # 4. Truyền kết quả mảng lại cho LLM để nó sinh câu trả lời tự nhiên
        if is_available:
            return f"Dạ nhà hàng bên em hiện vẫn còn bàn trống lúc {extracted_time} cho {extracted_guests} người. Anh/chị có muốn em tiến hành đặt bàn luôn không ạ?"
        else:
            return f"Rất tiếc nhà hàng bên em đã kín bàn lúc {extracted_time}. Anh/chị có thể chuyển sang khung giờ khác không ạ?"
            
    # Xử lý hội thoại bình thường không cần chạy tool
    return f"Câu trả lời từ AI cho câu hỏi: '{message}'"
