import qrcode
import io
import base64
from PIL import Image
from pyzbar.pyzbar import decode

class TicketGenerator:
    @staticmethod
    def generate_qr(booking_id: str) -> str:
        """
        Create QR code for booking_id
        Return base64 string of image to embed directly into HTML Email (<img> tag)
        without saving file to disk.
        """
        # ==========================================
        # 1. URL Base (To test temporarily)
        data_to_encode = "https://example.com/check-in/dummy-ticket-123"
        # ==========================================
        
        # 2. URL
        # When the web frontend has a check-in page (e.g., real domain: restaurant.com)
        # Staff will be directed to: https://restaurant.com/admin/check-in?id=99
        # data_to_encode = f"https://spiceoflife.demo/check-in?booking_id={booking_id}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(data_to_encode)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save image to RAM (BytesIO) instead of hard disk
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        
        # Convert Byte to Base64 string for Web
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Prefix data:image to make <img> tag understand
        return f"data:image/png;base64,{img_str}"

    @staticmethod
    def decode_qr(image_path: str) -> str:
        """
        Read QR code from an image file and decode it into text (URL / ID).
        For AI Agent or Receptionist's Upload flow.
        """
        try:
            # Open image using Pillow library
            img = Image.open(image_path)
            
            # Scan and decode all QR/Barcodes in the image using pyzbar
            decoded_objects = decode(img)
            
            if not decoded_objects:
                return "Không tìm thấy mã QR nào trong bức ảnh."
                
            # Return the result of the first QR code found
            # Pyzbar returns data in byte format (b'https...'), need to decode('utf-8')
            first_qr_data = decoded_objects[0].data.decode('utf-8')
            return first_qr_data
            
        except Exception as e:
            return f"Lỗi trong quá trình giải mã hình ảnh: {str(e)}"

# Initialize Singleton
ticket_generator = TicketGenerator()
