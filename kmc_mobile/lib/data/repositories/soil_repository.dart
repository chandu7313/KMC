import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/models.dart';

final soilRepositoryProvider = Provider<SoilRepository>((ref) {
  return SoilRepository(ref.watch(dioProvider));
});

class SoilRepository {
  final Dio _dio;
  SoilRepository(this._dio);

  /// Upload soil report with optional image
  Future<Map<String, dynamic>> uploadReport({
    String? imagePath,
    double? ph,
    double? nitrogen,
    double? phosphorus,
    double? potassium,
    double? organicMatter,
  }) async {
    final formData = FormData();

    if (imagePath != null) {
      formData.files.add(MapEntry(
        'reportFile',
        await MultipartFile.fromFile(imagePath, filename: 'soil_report.jpg'),
      ));
    }

    if (ph != null) formData.fields.add(MapEntry('ph', ph.toString()));
    if (nitrogen != null) formData.fields.add(MapEntry('nitrogen', nitrogen.toString()));
    if (phosphorus != null) formData.fields.add(MapEntry('phosphorus', phosphorus.toString()));
    if (potassium != null) formData.fields.add(MapEntry('potassium', potassium.toString()));
    if (organicMatter != null) formData.fields.add(MapEntry('organicMatter', organicMatter.toString()));

    final response = await _dio.post(
      AppConstants.soilUpload,
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return response.data;
  }

  /// Get soil test history for current user
  Future<List<SoilReportModel>> fetchHistory() async {
    final response = await _dio.get(AppConstants.soilHistory);
    if (response.data['success'] == true) {
      return (response.data['data'] as List)
          .map((r) => SoilReportModel.fromJson(r))
          .toList();
    }
    return [];
  }

  /// Standalone analysis without saving
  Future<Map<String, dynamic>> analyzeStandalone({
    required double ph,
    required double nitrogen,
    required double phosphorus,
    required double potassium,
    double organicMatter = 0,
  }) async {
    final response = await _dio.post(AppConstants.soilAnalyze, data: {
      'ph': ph,
      'nitrogen': nitrogen,
      'phosphorus': phosphorus,
      'potassium': potassium,
      'organicMatter': organicMatter,
    });
    return response.data;
  }
}
