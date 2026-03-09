from rest_framework import permissions


class IsChatParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'chat'):
            chat = obj.chat
        else:
            chat = obj
        return chat.is_participant(request.user)
