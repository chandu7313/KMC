/// User model — matches the exact JSON shape returned by
/// GET /api/user/data → response.userData
class UserModel {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String role;
  final String? district;
  final List<String> crops;
  final bool isAccountVerified;
  final String? language;
  final String? preferredLanguage;
  final bool hasCompletedTour;
  final bool hasCompletedSurvey;
  final bool simpleMode;
  final List<UserAddress> addresses;

  const UserModel({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.role = 'user',
    this.district,
    this.crops = const [],
    this.isAccountVerified = false,
    this.language,
    this.preferredLanguage,
    this.hasCompletedTour = false,
    this.hasCompletedSurvey = false,
    this.simpleMode = false,
    this.addresses = const [],
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'],
      phone: json['phone'],
      role: json['role'] ?? 'user',
      district: json['district'],
      crops: json['crops'] != null
          ? List<String>.from(json['crops'])
          : [],
      isAccountVerified: json['isAccountVerified'] ?? json['is_account_verified'] ?? false,
      language: json['language'],
      preferredLanguage: json['preferredLanguage'] ?? json['preferred_language'],
      hasCompletedTour: json['hasCompletedTour'] ?? json['has_completed_tour'] ?? false,
      hasCompletedSurvey: json['hasCompletedSurvey'] ?? json['has_completed_survey'] ?? false,
      simpleMode: json['simpleMode'] ?? json['simple_mode'] ?? false,
      addresses: json['addresses'] != null
          ? (json['addresses'] as List).map((a) => UserAddress.fromJson(a)).toList()
          : [],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'role': role,
    'district': district,
    'crops': crops,
    'isAccountVerified': isAccountVerified,
    'language': language,
    'preferredLanguage': preferredLanguage,
    'hasCompletedTour': hasCompletedTour,
    'hasCompletedSurvey': hasCompletedSurvey,
    'simpleMode': simpleMode,
  };

  bool get isAdmin => role == 'admin';
  bool get isFieldOfficer => role == 'field-officer';
  bool get isFarmer => role == 'user';
}

/// User address — from user_addresses table
class UserAddress {
  final String? id;
  final String fullName;
  final String phone;
  final String address;

  const UserAddress({
    this.id,
    required this.fullName,
    required this.phone,
    required this.address,
  });

  factory UserAddress.fromJson(Map<String, dynamic> json) {
    return UserAddress(
      id: json['id'],
      fullName: json['full_name'] ?? json['fullName'] ?? '',
      phone: json['phone'] ?? '',
      address: json['address'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'phone': phone,
    'address': address,
  };
}
