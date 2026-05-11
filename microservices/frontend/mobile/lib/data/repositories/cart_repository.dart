import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_constants.dart';
import '../../core/network/dio_client.dart';

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  return CartRepository(ref.watch(dioProvider));
});

class CartRepository {
  final Dio _dio;
  CartRepository(this._dio);

  /// Get cart data for user
  Future<Map<String, dynamic>> getCart(String userId) async {
    final response = await _dio.post(AppConstants.cartGet, data: {
      'userId': userId,
    });
    return response.data;
  }

  /// Update cart item quantity
  Future<Map<String, dynamic>> updateCart({
    required String itemId,
    required int quantity,
  }) async {
    final response = await _dio.post(AppConstants.cartUpdate, data: {
      'itemId': itemId,
      'quantity': quantity,
    });
    return response.data;
  }
}
