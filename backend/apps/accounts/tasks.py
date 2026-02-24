from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from apps.accounts.models import User


@shared_task
def send_password_reset_email(email, subject, message):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

@shared_task
def send_verification_code_email(email, code):
    subject = 'Aspect - Verification Code'
    message = f'Your verification code is: {code}\n\n'
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

@shared_task
def send_welcome_email(user_id):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return
    subject = 'Aspect - Welcome'
    message = (
        f'Hi {user.username},\n\n'
        'Your email is verified. You are now registered on Aspect.\n\n'
        'Welcome aboard!'
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )