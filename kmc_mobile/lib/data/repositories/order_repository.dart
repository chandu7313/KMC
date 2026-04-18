import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/models.dart';

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepository(ref.watch(dioProvider));
});

class OrderRepository {
  final Dio _dio;
  OrderRepository(this._dio);

  /// Fetch user's order history
  Future<List<OrderModel>> fetchUserOrders(String userId) async {
    final response = await _dio.post(AppConstants.orderUserOrders, data: {
      'userId': userId,
    });
    if (response.data['success'] == true) {
      return (response.data['orders'] as List)
          .map((o) => OrderModel.fromJson(o))
          .toList();
    }
    return [];
  }

  /// Place COD order
  Future<Map<String, dynamic>> placeOrder({
    required String userId,
    required List<Map<String, dynamic>> items,
    required num amount,
    required dynamic address,
  }) async {
    final response = await _dio.post(AppConstants.orderPlace, data: {
      'userId': userId,
      'items': items,
      'amount': amount,
      'address': address,
      'paymentMethod': 'COD',
    });
    return response.data;
  }

  /// Create Razorpay order
  Future<Map<String, dynamic>> createRazorpayOrder({
    required String userId,
    required List<Map<String, dynamic>> items,
    required num amount,
    required dynamic address,
  }) async {
    final response = await _dio.post(AppConstants.orderPlaceRazorpay, data: {
      'userId': userId,
      'items': items,
      'amount': amount,
      'address': address,
    });
    return response.data;
  }

  /// Verify Razorpay payment
  Future<Map<String, dynamic>> verifyRazorpay({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String dbOrderId,
    required String userId,
  }) async {
    final response = await _dio.post(AppConstants.orderVerifyRazorpay, data: {
      'razorpay_order_id': razorpayOrderId,
      'razorpay_payment_id': razorpayPaymentId,
      'razorpay_signature': razorpaySignature,
      'dbOrderId': dbOrderId,
      'userId': userId,
    });
    return response.data;
  }

  /// Cancel order
  Future<Map<String, dynamic>> cancelOrder({
    required String orderId,
    required String userId,
    String? reason,
  }) async {
    final response = await _dio.post(AppConstants.orderCancel, data: {
      'orderId': orderId,
      'userId': userId,
      'reason': reason ?? 'Cancelled by user',
    });
    return response.data;
  }
}
