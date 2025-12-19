from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

from contacts.views import ContactViewSet
from leads.views import LeadViewSet
from deals.views import DealViewSet
from activities.views import ActivityViewSet
from tags.views import TagViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(),name='health-check'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    # API Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
