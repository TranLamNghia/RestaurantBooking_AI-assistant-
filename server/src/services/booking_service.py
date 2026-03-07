from src.data_layer.queries import get_booked_tables_count, insert_new_booking

# Giả sử sức chứa tối đa của nhà hàng tại một thời điểm
MAX_CAPACITY = 50 

async def check_availability(time: str, guests: int) -> bool:
    """
    Logic nghiệp vụ thực tế: Kiểm tra xem nhà hàng có đủ sức chứa tại thời gian 'time' không.
    Gọi xuống DataLayer để lấy dữ liệu thực tế từ DB.
    """
    print(f"[Service] Xử lý nghiệp vụ check_availability cho lúc {time}, {guests} khách...")
    
    # Gọi data layer để thực thi cú pháp SQL/lấy data
    current_booked = await get_booked_tables_count(time)
    
    if current_booked + guests <= MAX_CAPACITY:
        return True
    return False

async def book_table(customer_name: str, time: str, guests: int, phone: str = "") -> dict:
    """
    Logic nghiệp vụ đặt bàn: kiểm tra trống -> insert DB -> gửi email confirm (nếu có)
    """
    is_available = await check_availability(time, guests)
    if not is_available:
        return {"success": False, "message": "Nhà hàng đã không còn đủ chỗ trống."}
        
    # Gọi data layer để Create
    booking_id = await insert_new_booking(customer_name, time, guests, phone)
    
    return {
        "success": True, 
        "booking_id": booking_id,
        "message": "Đặt bàn thành công!"
    }
