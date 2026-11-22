import logging
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

@shared_task(name="users.tasks.send_approval_email")
def send_approval_email(user_id):
    """
    Celery task that sends an activation notification email when an admin approves a user account.
    """
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        subject = "Your AirBooking Account Has Been Approved!"
        recipient_name = f"{user.first_name} {user.last_name}".strip() or user.username
        
        message = (
            f"Hello {recipient_name},\n\n"
            f"Great news! Your AirBooking account (username: {user.username}) has been reviewed and approved by an administrator.\n\n"
            f"You can now log in to search flights, reserve seats, and manage your trips:\n"
            f"http://localhost:5173/login\n\n"
            f"Thank you for choosing AirBooking!\n"
            f"The AirBooking Team"
        )
        
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'notifications@airbooking.com'),
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Activation email sent successfully to user {user.username} ({user.email}).")
        return f"Activation email sent to {user.email}"
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} does not exist.")
        return f"User {user_id} not found"
    except Exception as exc:
        logger.exception(f"Failed to send activation email to user {user_id}: {exc}")
        raise exc


def trigger_approval_email(user_id):
    """
    Triggers the Celery task asynchronously. If Celery broker is unavailable (e.g. offline dev mode),
    gracefully executes synchronously so the admin approval flow is reliable.
    """
    try:
        send_approval_email.delay(user_id)
        logger.info(f"Celery task dispatched for user {user_id}")
    except Exception as exc:
        logger.warning(f"Celery broker unavailable, executing email task directly: {exc}")
        send_approval_email(user_id)
