from rest_framework.pagination import CursorPagination, PageNumberPagination


class FeedPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedCursorPagination(CursorPagination):
    ordering = '-created_at'
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedListCursorPagination(CursorPagination):
    ordering = ['-is_today_top5', '-sort_key', '-created_at', '-id']
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
