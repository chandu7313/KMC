import 'package:intl/intl.dart';

/// Date and number formatting helpers used across the app.
class Formatters {
  Formatters._();

  // --- Date Formatters ---
  static String formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (_) {
      return isoDate;
    }
  }

  static String formatDateShort(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('dd/MM/yy').format(date);
    } catch (_) {
      return isoDate;
    }
  }

  static String formatDateTime(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (_) {
      return isoDate;
    }
  }

  static String timeAgo(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '';
    try {
      final date = DateTime.parse(isoDate);
      final diff = DateTime.now().difference(date);
      if (diff.inDays > 365) return '${(diff.inDays / 365).floor()}y ago';
      if (diff.inDays > 30) return '${(diff.inDays / 30).floor()}mo ago';
      if (diff.inDays > 0) return '${diff.inDays}d ago';
      if (diff.inHours > 0) return '${diff.inHours}h ago';
      if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
      return 'Just now';
    } catch (_) {
      return '';
    }
  }

  // --- Currency Formatters ---
  static String currency(num? amount) {
    if (amount == null) return '₹0';
    return NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0)
        .format(amount);
  }

  static String currencyCompact(num? amount) {
    if (amount == null) return '₹0';
    return NumberFormat.compactCurrency(locale: 'en_IN', symbol: '₹', decimalDigits: 1)
        .format(amount);
  }

  // --- Number Formatters ---
  static String compact(num? value) {
    if (value == null) return '0';
    return NumberFormat.compact().format(value);
  }

  // --- Phone Formatter ---
  static String maskPhone(String? phone) {
    if (phone == null || phone.length < 10) return phone ?? '';
    return '${phone.substring(0, 2)}****${phone.substring(phone.length - 4)}';
  }
}
