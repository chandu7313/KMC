/// App-wide constants — API paths, storage keys, static values.
class AppConstants {
  AppConstants._();

  // --- Storage Keys ---
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';

  // --- API Endpoints: Auth ---
  static const String sendOtp = '/auth/send-otp';
  static const String verifyOtp = '/auth/verify-otp';
  static const String autoLogin = '/auth/auto-login';
  static const String isAuth = '/auth/is-auth';
  static const String logout = '/auth/logout';

  // --- API Endpoints: User ---
  static const String getUserData = '/user/data';
  static const String updateLanguage = '/user/language';
  static const String updatePreferences = '/user/preferences';
  static const String saveAddress = '/user/address';

  // --- API Endpoints: Soil ---
  static const String soilUpload = '/soil/upload';
  static const String soilHistory = '/soil/history';
  static const String soilDownload = '/soil/download'; // + /:id
  static const String soilAnalyze = '/soil/analyze';

  // --- API Endpoints: Market ---
  static const String marketPrices = '/market/prices';
  static const String marketTrend = '/market/trend';
  static const String marketRecommendation = '/market/recommendation';
  static const String marketRealtime = '/market/realtime';

  // --- API Endpoints: Products ---
  static const String productList = '/product/list';
  static const String productSingle = '/product/single';

  // --- API Endpoints: Cart ---
  static const String cartGet = '/cart/get';
  static const String cartUpdate = '/cart/update';

  // --- API Endpoints: Orders ---
  static const String orderPlace = '/order/place';
  static const String orderPlaceRazorpay = '/order/razorpay';
  static const String orderVerifyRazorpay = '/order/verifyRazorpay';
  static const String orderUserOrders = '/order/userorders';
  static const String orderCancel = '/order/cancel';

  // --- API Endpoints: Fertilizers ---
  static const String fertilizerList = '/fertilizer/list';
  static const String fertilizerOrder = '/fertilizer/order';
  static const String fertilizerUserOrders = '/fertilizer/user-orders';

  // --- API Endpoints: Equipment ---
  static const String equipmentList = '/equipment/list';
  static const String equipmentOrder = '/equipment/order';
  static const String equipmentUserOrders = '/equipment/user-orders';

  // --- API Endpoints: Blogs ---
  static const String blogList = '/blog/published';
  static const String blogDetail = '/blog'; // + /:slug

  // --- API Endpoints: Success Stories ---
  static const String successStories = '/success/published';

  // --- API Endpoints: Booking ---
  static const String bookingCreate = '/booking/create';
  static const String bookingUser = '/booking/user';

  // --- API Endpoints: Survey ---
  static const String surveyGet = '/survey';
  static const String surveySave = '/survey/save';

  // --- API Endpoints: Orchard ---
  static const String orchardRequest = '/orchard/request';

  // --- Misc ---
  static const int otpLength = 6;
  static const int otpResendSeconds = 60;
}
