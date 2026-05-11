/// Product model — matches GET /api/product/list response
class ProductModel {
  final String id;
  final String name;
  final String? description;
  final String? shortDescription;
  final String? category;
  final String? subCategory;
  final num price;
  final int stock;
  final List<String> images;
  final Map<String, dynamic>? specifications;
  final bool isFeatured;
  final String? createdAt;

  const ProductModel({
    required this.id,
    required this.name,
    this.description,
    this.shortDescription,
    this.category,
    this.subCategory,
    required this.price,
    this.stock = 0,
    this.images = const [],
    this.specifications,
    this.isFeatured = false,
    this.createdAt,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      shortDescription: json['short_description'],
      category: json['category'],
      subCategory: json['sub_category'],
      price: json['price'] ?? 0,
      stock: json['stock'] ?? 0,
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      specifications: json['specifications'],
      isFeatured: json['is_featured'] ?? false,
      createdAt: json['created_at'],
    );
  }
}

/// Soil report — matches GET /api/soil/history response
class SoilReportModel {
  final String id;
  final String? farmerId;
  final String? reportFile;
  final String status;
  final double? ph;
  final double? nitrogen;
  final double? phosphorus;
  final double? potassium;
  final double? organicMatter;
  final String? recommendedFertilizer;
  final List<String> suitableCrops;
  final String? soilStatus;
  final num? suitabilityPct;
  final String? nextTestDate;
  final String? createdAt;

  const SoilReportModel({
    required this.id,
    this.farmerId,
    this.reportFile,
    this.status = 'Pending',
    this.ph,
    this.nitrogen,
    this.phosphorus,
    this.potassium,
    this.organicMatter,
    this.recommendedFertilizer,
    this.suitableCrops = const [],
    this.soilStatus,
    this.suitabilityPct,
    this.nextTestDate,
    this.createdAt,
  });

  factory SoilReportModel.fromJson(Map<String, dynamic> json) {
    return SoilReportModel(
      id: json['id'] ?? '',
      farmerId: json['farmer_id'],
      reportFile: json['report_file'],
      status: json['status'] ?? 'Pending',
      ph: (json['ph'] as num?)?.toDouble(),
      nitrogen: (json['nitrogen'] as num?)?.toDouble(),
      phosphorus: (json['phosphorus'] as num?)?.toDouble(),
      potassium: (json['potassium'] as num?)?.toDouble(),
      organicMatter: (json['organic_matter'] as num?)?.toDouble(),
      recommendedFertilizer: json['recommended_fertilizer'],
      suitableCrops: json['suitable_crops'] != null
          ? List<String>.from(json['suitable_crops'])
          : [],
      soilStatus: json['soil_status'],
      suitabilityPct: json['suitability_pct'],
      nextTestDate: json['next_test_date'],
      createdAt: json['created_at'],
    );
  }
}

/// Market price — matches GET /api/market/prices response
class MarketPriceModel {
  final String id;
  final String cropName;
  final String? variety;
  final String? district;
  final String? mandi;
  final num? modalPrice;
  final num? minPrice;
  final num? maxPrice;
  final String? arrivalDate;

  const MarketPriceModel({
    required this.id,
    required this.cropName,
    this.variety,
    this.district,
    this.mandi,
    this.modalPrice,
    this.minPrice,
    this.maxPrice,
    this.arrivalDate,
  });

  factory MarketPriceModel.fromJson(Map<String, dynamic> json) {
    return MarketPriceModel(
      id: json['id'] ?? '',
      cropName: json['crop_name'] ?? '',
      variety: json['variety'],
      district: json['district'],
      mandi: json['mandi'],
      modalPrice: json['modal_price'],
      minPrice: json['min_price'],
      maxPrice: json['max_price'],
      arrivalDate: json['arrival_date'],
    );
  }
}

/// Order model — matches GET /api/order/userorders response
class OrderModel {
  final String id;
  final String? userId;
  final num totalAmount;
  final dynamic address;
  final String? paymentMethod;
  final String? paymentStatus;
  final String status;
  final List<OrderItemModel> items;
  final String? createdAt;

  const OrderModel({
    required this.id,
    this.userId,
    required this.totalAmount,
    this.address,
    this.paymentMethod,
    this.paymentStatus,
    this.status = 'Pending',
    this.items = const [],
    this.createdAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] ?? '',
      userId: json['user_id'],
      totalAmount: json['total_amount'] ?? 0,
      address: json['address'],
      paymentMethod: json['payment_method'],
      paymentStatus: json['payment_status'],
      status: json['status'] ?? 'Pending',
      items: json['items'] != null
          ? (json['items'] as List).map((i) => OrderItemModel.fromJson(i)).toList()
          : [],
      createdAt: json['created_at'],
    );
  }
}

class OrderItemModel {
  final String? id;
  final String? productId;
  final int quantity;
  final num price;
  final ProductModel? product;

  const OrderItemModel({
    this.id,
    this.productId,
    this.quantity = 1,
    this.price = 0,
    this.product,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      id: json['id'],
      productId: json['product_id'],
      quantity: json['quantity'] ?? 1,
      price: json['price'] ?? 0,
      product: json['productId'] != null && json['productId'] is Map
          ? ProductModel.fromJson(json['productId'])
          : null,
    );
  }
}

/// Blog model — matches GET /api/blog/published response
class BlogModel {
  final String id;
  final String title;
  final String? excerpt;
  final String? content;
  final String? author;
  final String? slug;
  final String? featuredImage;
  final List<String> tags;
  final int views;
  final String? createdAt;

  const BlogModel({
    required this.id,
    required this.title,
    this.excerpt,
    this.content,
    this.author,
    this.slug,
    this.featuredImage,
    this.tags = const [],
    this.views = 0,
    this.createdAt,
  });

  factory BlogModel.fromJson(Map<String, dynamic> json) {
    return BlogModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      excerpt: json['excerpt'],
      content: json['content'],
      author: json['author'],
      slug: json['slug'],
      featuredImage: json['featured_image'],
      tags: json['tags'] != null ? List<String>.from(json['tags']) : [],
      views: json['views'] ?? 0,
      createdAt: json['created_at'],
    );
  }
}

/// Booking model — matches GET /api/booking/user response
class BookingModel {
  final String id;
  final String? farmerId;
  final String fullName;
  final String phone;
  final String village;
  final String district;
  final String? visitDate;
  final String purpose;
  final String status;
  final String? createdAt;

  const BookingModel({
    required this.id,
    this.farmerId,
    required this.fullName,
    required this.phone,
    required this.village,
    required this.district,
    this.visitDate,
    required this.purpose,
    this.status = 'Pending',
    this.createdAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] ?? '',
      farmerId: json['farmer_id'],
      fullName: json['full_name'] ?? '',
      phone: json['phone'] ?? '',
      village: json['village'] ?? '',
      district: json['district'] ?? '',
      visitDate: json['visit_date'],
      purpose: json['purpose'] ?? '',
      status: json['status'] ?? 'Pending',
      createdAt: json['created_at'],
    );
  }
}
