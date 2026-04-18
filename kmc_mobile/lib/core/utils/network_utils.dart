import 'package:connectivity_plus/connectivity_plus.dart';

/// Utility class for checking network connectivity.
class NetworkUtils {
  NetworkUtils._();

  static Future<bool> hasConnection() async {
    final result = await Connectivity().checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }
}
