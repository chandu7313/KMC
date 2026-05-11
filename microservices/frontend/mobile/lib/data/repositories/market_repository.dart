import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/models.dart';

final marketRepositoryProvider = Provider<MarketRepository>((ref) {
  return MarketRepository(ref.watch(dioProvider));
});

class MarketRepository {
  final Dio _dio;
  MarketRepository(this._dio);

  /// Fetch market prices with optional filters
  Future<List<MarketPriceModel>> fetchPrices({String? crop, String? district}) async {
    final queryParams = <String, dynamic>{};
    if (crop != null) queryParams['crop'] = crop;
    if (district != null) queryParams['district'] = district;

    final response = await _dio.get(
      AppConstants.marketPrices,
      queryParameters: queryParams,
    );
    if (response.data['success'] == true) {
      return (response.data['prices'] as List)
          .map((p) => MarketPriceModel.fromJson(p))
          .toList();
    }
    return [];
  }

  /// Get trend data for crop+district
  Future<Map<String, dynamic>> fetchTrend(String crop, String district) async {
    final response = await _dio.get(AppConstants.marketTrend, queryParameters: {
      'crop': crop,
      'district': district,
    });
    return response.data;
  }

  /// Get selling recommendation
  Future<Map<String, dynamic>> fetchRecommendation(String crop, String district) async {
    final response = await _dio.get(AppConstants.marketRecommendation, queryParameters: {
      'crop': crop,
      'district': district,
    });
    return response.data;
  }
}
