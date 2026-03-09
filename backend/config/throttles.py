from rest_framework.throttling import UserRateThrottle, AnonRateThrottle


class AuthRateThrottle(AnonRateThrottle):
    scope = 'auth'


class AuthUserRateThrottle(UserRateThrottle):
    scope = 'auth_user'


class PostRateThrottle(UserRateThrottle):
    scope = 'post'


class MessageRateThrottle(UserRateThrottle):
    scope = 'message'


class CommentRateThrottle(UserRateThrottle):
    scope = 'comment'


class LikeRateThrottle(UserRateThrottle):
    scope = 'like'


class SubscriptionRateThrottle(UserRateThrottle):
    scope = 'subscription'


class ReportRateThrottle(UserRateThrottle):
    scope = 'report'
