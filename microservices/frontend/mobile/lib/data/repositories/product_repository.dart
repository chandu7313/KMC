import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/models.dart';

final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return ProductRepository(ref.watch(dioProvider));
});

class ProductRepository {
  final Dio _dio;
  ProductRepository(this._dio);

  Future<List<ProductModel>> fetchProducts() async {
    final response = await _dio.get(AppConstants.productList);
    if (response.data['success'] == true) {
      return (response.data['products'] as List)
          .map((p) => ProductModel.fromJson(p))
          .toList();
    }
    return [];
  }

  Future<ProductModel?> fetchProductById(String id) async {
    final response = await _dio.post(AppConstants.productSingle, data: {'productId': id});
    if (response.data['success'] == true) {
      return ProductModel.fromJson(response.data['product']);
    }
    return null;
  }
}
