import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TShirt {
    color: Color;
    size: Size;
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    paymentSessionId?: string;
    user: Principal;
    items: Array<TShirt>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Inquiry {
    id: string;
    status: InquiryStatus;
    serviceType: ServiceType;
    user: Principal;
    email: string;
    message: string;
    replies: Array<string>;
}
export interface Product {
    id: string;
    availableColors: Array<Color>;
    name: string;
    description: string;
    availableSizes: Array<Size>;
    image: ExternalBlob;
    priceCents: bigint;
}
export enum Color {
    red = "red",
    blue = "blue",
    green = "green",
    black = "black",
    white = "white",
    yellow = "yellow"
}
export enum InquiryStatus {
    open = "open",
    completed = "completed",
    inProgress = "inProgress"
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    paid = "paid",
    delivered = "delivered"
}
export enum ServiceType {
    modeling3D = "modeling3D",
    videoEditing = "videoEditing",
    websiteDesign = "websiteDesign",
    contentCreation = "contentCreation"
}
export enum Size {
    l = "l",
    m = "m",
    s = "s",
    xl = "xl"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInquiryReply(inquiryId: string, reply: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiry(inquiryId: string): Promise<Inquiry>;
    getOrder(orderId: string): Promise<Order>;
    getProduct(productId: string): Promise<Product>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserInquiries(user: Principal): Promise<Array<Inquiry>>;
    getUserOrders(user: Principal): Promise<Array<Order>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(order: Order): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitInquiry(inquiry: Inquiry): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateInquiryStatus(inquiryId: string, status: InquiryStatus): Promise<void>;
    updateOrderPayment(orderId: string, sessionId: string): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
