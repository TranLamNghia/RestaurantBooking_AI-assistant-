import os
import mailtrap as mt
from src.infrastructure.ticket_generator import ticket_generator

class EmailService:
    def __init__(self):
        self.mailtrap_token = os.getenv("MAILTRAP_TOKEN")
        self.sender_email = "mailtrap@demomailtrap.com"
        self.sender_name = "Spice of Life AI"
        
        # Get absolute file path of HTML template
        self.template_dir = os.path.join(os.path.dirname(__file__), "templates")
        
    def _render_html_template(self, template_name: str, context: dict) -> str:
        """Read HTML file and replace {{ key }} variables with values."""
        template_path = os.path.join(self.template_dir, template_name)
        with open(template_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        for key, value in context.items():
            html_content = html_content.replace(f"{{{{ {key} }}}}", str(value))
            
        return html_content

    async def send_pending_booking_email(
        self, 
        to_email: str, 
        customer_name: str, 
        reservation_day: str, 
        reservation_time: str, 
        preferred_space: str,
        guests: int,
        booking_id: int
    ) -> bool:
        """
        Gửi email cho khách ngay sau khi điền form đặt bàn, yêu cầu họ click link để đặt cọc.
        """
        if not self.mailtrap_token:
            print("[EMAIL SERVICE ERROR] MAILTRAP_TOKEN is not set in .env")
            return False
            
        try:
            context = {
                "customer_name": customer_name,
                "reservation_day": reservation_day,
                "reservation_time": reservation_time,
                "preferred_space": preferred_space,
                "guests": guests,
                "booking_id": booking_id
            }
            html_content = self._render_html_template("booking_confirmation.html", context)

            mail = mt.Mail(
                sender=mt.Address(email=self.sender_email, name=self.sender_name),
                to=[mt.Address(email=to_email)],
                subject="Yêu cầu xác nhận đặt bàn - Spice of Life AI",
                html=html_content,
                category="Pending Booking",
            )

            client = mt.MailtrapClient(token=self.mailtrap_token)
            response = client.send(mail)
            print(f"[EMAIL SERVICE] Đã gửi thư yêu cầu đặt cọc tới {to_email}. Phản hồi: {response}")
            return True
        except Exception as e:
            print(f"[EMAIL SERVICE ERROR] Lỗi khi gửi mail đặt cọc: {e}")
            return False

    async def send_reservation_confirmation(
        self, 
        to_email: str, 
        customer_name: str, 
        customer_phone: str,
        reservation_day: str, 
        reservation_time: str, 
        preferred_space: str,
        has_preorder: str,
        booking_id: int
    ) -> bool:
        if not self.mailtrap_token:
            print("[EMAIL SERVICE ERROR] MAILTRAP_TOKEN is not set in .env")
            return False
            
        try:
            qr_base64 = ticket_generator.generate_qr(str(booking_id))
            
            context = {
                "qr_code_base64": qr_base64,
                "customer_name": customer_name,
                "customer_phone": customer_phone,
                "reservation_day": reservation_day,
                "reservation_time": reservation_time,
                "preferred_space": preferred_space,
                "has_preorder": has_preorder,
                "booking_id": booking_id
            }
            html_content = self._render_html_template("e_ticket.html", context)

            # Create mail object với HTML
            mail = mt.Mail(
                sender=mt.Address(email=self.sender_email, name=self.sender_name),
                to=[mt.Address(email=to_email)],
                subject="[E-Ticket] Xác nhận đặt bàn - Spice of Life AI",
                html=html_content,
                category="Reservation Confirmation",
            )

            # Create client and send
            client = mt.MailtrapClient(token=self.mailtrap_token)
            response = client.send(mail)
            
            print(f"[EMAIL SERVICE] Đã gửi thông báo tới {to_email}. Phản hồi: {response}")
            return True
        except Exception as e:
            print(f"[EMAIL SERVICE ERROR] Lỗi khi gửi mail: {e}")
            return False

    async def resend_confirmation_ticket(
        self, 
        to_mail: str, 
        customer_name: str, 
        customer_phone: str,
        reservation_day: str, 
        reservation_time: str, 
        preferred_space: str,
        has_preorder: str,
        booking_id: int
    ) -> bool:
        """
        Gửi lại email xác nhận đặt bàn cho khách hàng.
        """
        return await self.send_reservation_confirmation(
            to_email=to_mail, 
            customer_name=customer_name, 
            customer_phone=customer_phone,
            reservation_day=reservation_day, 
            reservation_time=reservation_time, 
            preferred_space=preferred_space,
            has_preorder=has_preorder,
            booking_id=booking_id
        )

# Khởi tạo một instance duy nhất để các file khác import dùng chung (Singleton)
email_service = EmailService()
