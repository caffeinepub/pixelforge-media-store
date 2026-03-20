import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // ===== Migration stubs: absorb old PixelForge stable vars =====
  // These keep the OLD variable names with OLD types so the upgrade is compatible.
  // The old data (T-shirts / inquiries) is intentionally discarded.

  type _V1_Size  = { #s; #m; #l; #xl };
  type _V1_Color = { #white; #black; #red; #blue; #green; #yellow };
  type _V1_Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    availableSizes : [_V1_Size];
    availableColors : [_V1_Color];
    image : Storage.ExternalBlob;
  };
  type _V1_OrderStatus = { #pending; #paid; #shipped; #delivered };
  type _V1_OrderItem   = { productId : Text; size : _V1_Size; color : _V1_Color; quantity : Nat };
  type _V1_Order = {
    id : Text;
    user : Principal;
    items : [_V1_OrderItem];
    status : _V1_OrderStatus;
    paymentSessionId : ?Text;
  };
  type _V1_InquiryStatus = { #open; #inProgress; #completed };
  type _V1_ServiceType   = { #videoEditing; #contentCreation; #modeling3D; #websiteDesign };
  type _V1_Inquiry = {
    id : Text;
    user : Principal;
    serviceType : _V1_ServiceType;
    email : Text;
    message : Text;
    status : _V1_InquiryStatus;
    replies : [Text];
  };

  // These variable names MUST match the old deployment exactly.
  // They absorb the stable memory so Motoko does not reject the upgrade.
  let products  = Map.empty<Text, _V1_Product>();
  let orders    = Map.empty<Text, _V1_Order>();
  let inquiries = Map.empty<Text, _V1_Inquiry>();

  // ===== PixelKart types =====
  type Category = { #personalCare; #electronics; #homeGoods };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Category;
    imageUrl : Text;
    stock : Nat;
    isFeatured : Bool;
    isTrending : Bool;
  };

  type CartItem = { productId : Text; quantity : Nat };

  type OrderStatus = { #pending; #paid; #processing; #shipped; #delivered; #cancelled };

  type OrderItem = {
    productId : Text;
    productName : Text;
    priceCents : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Text;
    user : Principal;
    items : [OrderItem];
    totalCents : Nat;
    status : OrderStatus;
    paymentSessionId : ?Text;
    createdAt : Int;
  };

  // ===== Component state =====
  let accessControlState = AccessControl.initState();
  // Hardcoded admin principals
  do {
    let admin1 = Principal.fromText("erchm-mxkti-yvgyi-fzfmo-tbs7q-egcnd-zwn2z-vy6pd-nckss-yekz4-jqe");
    let admin2 = Principal.fromText("gmb2n-joeva-xxs3n-ovi45-76o74-iawmq-sjkgz-2dyg5-ktcns-nhf2a-wqe");
    AccessControl.forceAdmin(accessControlState, admin1);
    AccessControl.forceAdmin(accessControlState, admin2);
  };
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ===== PixelKart stable storage (new names to avoid conflict) =====
  let kartProducts = Map.empty<Text, Product>();
  let kartOrders   = Map.empty<Text, Order>();
  let carts        = Map.empty<Principal, [CartItem]>();

  // ===== Products =====

  public query func listProducts() : async [Product] {
    kartProducts.values().toArray();
  };

  public query func getProduct(productId : Text) : async Product {
    switch (kartProducts.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p)   { p };
    };
  };

  public query func getFeaturedProducts() : async [Product] {
    kartProducts.values().toArray().filter(func(p) { p.isFeatured });
  };

  public query func getTrendingProducts() : async [Product] {
    kartProducts.values().toArray().filter(func(p) { p.isTrending });
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    kartProducts.values().toArray().filter(func(p) { p.category == category });
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    kartProducts.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    kartProducts.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    kartProducts.remove(productId);
  };

  // ===== Cart =====

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null)   { [] };
      case (?items) { items };
    };
  };

  public shared ({ caller }) func updateCart(items : [CartItem]) : async () {
    carts.add(caller, items);
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  // ===== Orders =====

  public shared ({ caller }) func placeOrder(order : Order) : async () {
    if (caller != order.user) {
      Runtime.trap("Unauthorized");
    };
    kartOrders.add(order.id, order);
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    kartOrders.values().toArray().filter(func(o) { o.user == caller });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    kartOrders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    switch (kartOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o)   { kartOrders.add(orderId, { o with status }) };
    };
  };

  public shared ({ caller }) func updateOrderPayment(orderId : Text, sessionId : Text) : async () {
    switch (kartOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) {
        if (caller != o.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized");
        };
        kartOrders.add(orderId, { o with paymentSessionId = ?sessionId; status = #paid });
      };
    };
  };

  // ===== Stripe =====

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?c)   { c };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
