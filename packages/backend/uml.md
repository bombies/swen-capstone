### Domain Model

---

#### **Admin**

- **Associations**:
    - oversees: 1..1 Marketplace

---

#### **Catalog**

- **Associations**:
    - has: 1..1 Merchant
    - contains: 0..\* Product

---

#### **Customer**

- **Associations**:
    - manages: 1..1 Shopping Cart
    - makes: 0..\* Order
    - makes: 0..\* Payment
    - requests: 0..\* Refund

---

#### **Goods**

- **Generalization**:
    - inherits from Product

---

#### **Marketplace**

- **Associations**:
    - sells in: 0..\* Merchant
    - oversees: 0..\* Admin
    - stores: 1..1 Order
    - receives service fee: 0..\* Payment

---

#### **Merchant**

- **Associations**:
    - has: 1..1 Catalog
    - sells in: 1..1 Marketplace
    - receives: 0..\* Payment
    - supplies: 1..1 Order

---

#### **Order**

- **Associations**:
    - supplies: 1..1 Merchant
    - stores: 1..1 Marketplace
    - associated with: 1..1 Payment
    - contained in: 1..\* Product

---

#### **Payment**

- **Associations**:
    - facilitated by: 1..1 Payment Gateway
    - associated with: 1..1 Order
    - receives service fee: 1..1 Marketplace

---

#### **Payment Gateway**

- **Associations**:
    - facilitated by: 0..\* Payment

---

#### **Product**

- **Generalization**:
    - Goods inherits from this class
    - Service inherits from this class
- **Associations**:
    - contained in: 1..1 Order
    - contains: 1..1 Catalog
    - contains: 0..\* Shopping Cart

---

#### **Refund**

- **Associations**:
    - associated with: 1..1 Order

---

#### **Service**

- **Generalization**:
    - inherits from Product

---

#### **Shopping Cart**

- **Associations**:
    - manages: 1..1 Customer
    - contains: 0..\* Product

---

### Design Level Class Model

---

#### **AbstractCartProduct**

- **Stereotype**: abstract
- **Attributes**:
    - -selected: Boolean
- **Operations**:
    - +isSelectedForCheckout(): Boolean
    - +toggleSelection()
    - +getItemDetails(): Product
    - +getUnitPrice(): Integer
    - +calculateItemSubtotal(): Integer
- **Associations**:
    - CartItems: 0.._ Cart, 0.._ Product (shared)

---

#### **AbstractOrderItem**

- **Stereotype**: abstract
- **Attributes**:
    - -itemId: String
- **Operations**:
    - +getItemId(): String
    - +getProductDetails(): Product
    - +getQuantity(): Integer
    - +getUnitPrice(): Integer
    - +calculateSubtotal(): Integer
- **Associations**:
    - OrderProducts: 0.._ Product, 0.._ Order

---

#### **AbstractPaymentDetails**

- **Attributes**:
    - -email: String
- **Associations**:
    - PaymentDetails: 1..1 User (composite)

---

#### **Administrator**

- **Generalization**:
    - inherits from Role
- **Operations**:
    - +serialize(): String
    - +deserialize(stringified: String): Administrator

---

#### **AdminController**

- **Generalization**:
    - inherits from Controller
- **Operations**:
    - +execute(req: HttpRequest): HttpResponse
    - -createUser(req: HttpRequest): HttpResponse
    - -banUser(req: HttpRequest, dto: DTO): HttpResponse
    - -updateUser(req: HttpRequest, dto: DTO): HttpResponse
    - -deleteUser(req: HttpRequest): HttpResponse
    - -getLetterOfGoodStanding(req: HttpRequest): HttpResponse
- **Associations**:
    - 1..1 AdminService (shared)

---

#### **AuthService**

- **Attributes**:
    - -instance: AuthService
- **Operations**:
    - +encodeJWT(session: Session): String
    - +decodeJWT(token: String): Session
    - +login(usernameOrEmail: String, password: String): Session
    - +logout(session: Session)
    - +verifyJWT(token: String): Boolean
    - +getSession(req: HttpRequest): Session
- **Associations**:
    - 1..1 AuthController (shared)
    - 1..1 S3 (shared)

---

#### **Cart**

- **Operations**:
    - +addItem(product: Product, quantity: Integer)
    - +removeItem(item: AbstractCartProduct)
    - +updateItemQuantity(item: AbstractCartProduct, newQuantity: Integer)
    - +calculateTotal(): Integer
    - +getItems(): List<AbstractCartProduct>
    - +clearCart()
    - +selectItemForCheckout(item: AbstractCartProduct, isSelected: Boolean)
    - +getCheckoutItems(): List<AbstractCartProduct>
    - +isEmpty(): Boolean
    - +persistCart()
    - +checkAvailabilityOfItems()
    - +serialize(): String
    - +deserialize(stringified: String): Cart
- **Associations**:
    - CustomerCart: 1..1 Customer (composite)
    - 1..1 Role (composite)
    - 1..1 File (shared)

---

#### **Controller**

- **Generalization**:
    - AdminController inherits from this class
    - AuthController inherits from this class
    - ProductController inherits from this class
    - RefundController inherits from this class
- **Operations**:
    - +execute(req: HttpRequest): HttpResponse

---

#### **Customer**

- **Generalization**:
    - inherits from Role
- **Attributes**:
    - -shippingStreetAddress: String
    - -shippingCity: String
    - -shippingParish: String
- **Operations**:
    - +serialize(): String
    - +deserialize(stringified: String): Customer

---

#### **DatabaseService**

- **Attributes**:
    - -instance: DatabaseService
- **Operations**:
    - +put()
- **Associations**:
    - 1..1 UserService (shared)
    - 1..1 MerchantService (shared)
    - 1..1 AdminService (shared)
    - 1..1 ProductService (shared)
    - 1..1 OrderService (shared)
    - 1..1 CartService (shared)
    - 1..1 RefundService (shared)
    - 1..1 CatalogueService (shared)
    - 1..1 PaymentService (shared)
- **Dependencies**:
    - creates User
    - creates Product
    - creates Order
    - creates Transaction
    - creates Cart
    - creates RefundCase
    - creates RefundMessage
    - creates ProductCatalogue
    - uses CreateUserDto
    - uses UpdateUserDto
    - uses GetUserDto
    - uses DeleteUserDto
    - uses CreateCustomerDetailsDto
    - uses UpdateCustomerDetailsDto
    - uses DTO

---

#### **Date**

- **Stereotype**: dataType
- **Operations**:
    - +Date(day: Integer, month: Integer, year: Integer)
    - +add(days: Integer): Date

---

#### **DateTime**

- **Stereotype**: dataType
- **Operations**:
    - +DateTime(date: Date, time: Time)
    - +equals(dt: DateTime): Boolean
    - +isBefore(dt: DateTime): Boolean
    - +isAfter(dt: DateTime): Boolean
    - +isLeapYear(): Boolean
    - +add(days: Integer): DateTime
    - +subtract(days: Integer): DateTime
    - +now(): DateTime
    - +asNumber(): Integer

---

#### **DTO**

- **Operations**:
    - +DTO(): DTO
    - +serialize(): String
- **Dependencies**:
    - uses ProductService
    - uses PaymentService
    - uses OrderService
    - uses CartService
    - uses RefundService
    - uses CatalogueService
    - uses AdminService
    - uses MerchantService

---

#### **DTOBuilder**

- **Operations**:
    - +DTOBuilder(): DTOBuilder
    - +build(): DTO
    - +addEntry(key: String, value: String, type: String)
- **Associations**:
    - 1..\* KeyValuePair (composite)
- **Dependencies**:
    - uses KeyValuePair
    - creates DTO

---

#### **File**

- **Stereotype**: dataType
- **Attributes**:
    - -name: String
    - -path: String
    - -absolutePath: String
    - -canonicalPath: String
    - -parent: String?
    - -parentFile: File?
    - -totalSpace: Long
    - -freeSpace: Long
    - -usableSpace: Long
    - -lastModified: Long
- **Operations**:
    - +getName(): String
    - +getPath(): String
    - +getAbsolutePath(): String
    - +getCanonicalPath(): String
    - +getParent(): String?
    - +getParentFile(): File?
    - +getTotalSpace(): Long
    - +getFreeSpace(): Long
    - +getUsableSpace(): Long
    - +getLastModified(): Long
    - +exists(): Boolean
    - +isFile(): Boolean
    - +isDirectory(): Boolean
    - +isHidden(): Boolean
    - +canRead(): Boolean
    - +canWrite(): Boolean
    - +canExecute(): Boolean
    - +length(): Long
    - +createNewFile(): Boolean
    - +delete(): Boolean
    - +deleteOnExit(): Boolean
    - +mkdir(): Boolean
    - +mkdirs(): Boolean
    - +renameTo(des: File): Boolean
    - +setLastModified(time: Long): Boolean
    - +setReadOnly(): Boolean
    - +setWritable(writable: Boolean, ownerOnly: Boolean): Boolean
    - +setReadable(readable: Boolean, ownerOnly: Boolean): Boolean
    - +setExecutable(executable: Boolean, ownerOnly: Boolean): Boolean

---

#### **FileService**

- **Stereotype**: interface
- **Operations**:
    - +createBucket(req: Object): Object
    - +deleteBucket(req: Object): Object
    - +deleteObject(req: Object): Object
    - +deleteObjects(req: Object): Object
    - +getObject(req: Object): Object
    - +getObjectAsBytes(req: Object): Object
    - +headObject(req: Object): Object
    - +listBuckets(req: Object): Object
    - +listObjectsV2(req: Object): Object
    - +putObject(req: Object): Object
    - +uploadPart(req: Object, body: Object): Object

---

#### **GoodsCartItem**

- **Generalization**:
    - inherits from AbstractCartProduct
- **Attributes**:
    - -quantity: Integer
- **Operations**:
    - +getQuantity(): Integer
    - +setQuantity(newQuantity: Integer)
    - +incrementQuantity()
    - +decrementQuantity()

---

#### **GoodsOrderItem**

- **Generalization**:
    - inherits from AbstractOrderItem
- **Attributes**:
    - -quantity: Integer
- **Operations**:
    - +getQuantity(): Integer

---

#### **HashMap**

- **Stereotype**: dataType
- **Operations**:
    - +clear(): Void
    - +clone(): Object
    - +containsKey(Object key)
    - +containsValue(Object key)
    - +get(Object key)
    - +isEmpty(): Boolean
    - +put(key: Object, value: Object): Object
    - +remove(key: Object): Object
    - +size(): Integer

---

#### **HttpRequest**

- **Stereotype**: interface
- **Operations**:
    - +getHeaders(): Object
    - +getHeader(headerName: String): String?
    - +getMethod(): String
    - +getUri(): String
    - +getBody(): String
    - +getQueryParams(): HashMap
    - +getUser(): Object
    - +setAttribute(name: String, value: Object): void

---

#### **HttpResponse**

- **Stereotype**: interface
- **Operations**:
    - +setStatusCode(statusCode: Integer): void
    - +setHeader(headerName: String, headerValue: String): void
    - +setBody(body: String): void
    - +send(): void

---

#### **IRoute**

- **Stereotype**: interface
- **Operations**:
    - +execute(req: HttpRequest): HttpResponse

---

#### **KeyValuePair**

- **Attributes**:
    - -key: String
    - -value: String
    - -type: String
- **Operations**:
    - +KeyValuePair(key: String, value: String, type: String)
    - +getKey(): String
    - +getValue(): String
    - +getType(): String
- **Associations**:
    - Entries: 1..1 DTO (composite)

---

#### **LetterOfGoodStanding**

- **Attributes**:
    - +dateOfExpiry: DateTime
    - +objectKey: String
- **Associations**:
    - LettersOfGoodStanding: 1..1 Merchant (composite)
    - /lastestLetter: 1..1 Merchant

---

#### **Logger**

- **Stereotype**: interface
- **Operations**:
    - +log(level: LogLevel, message: String): void
    - +debug(message: String): void
    - +info(message: String): void
    - +warn(message: String): void
    - +error(message: String): void
    - +fatal(message: String): void

---

#### **LogLevel**

- **Stereotype**: enumeration
- **Literals**:
    - DEBUG
    - INFO
    - WARN
    - ERROR
    - FATAL

---

#### **LynkPaymentDetails**

- **Generalization**:
    - inherits from AbstractPaymentDetails
- **Attributes**:
    - -displayName: String
    - -lynkID: String
    - -phoneNumber: String
    - -email: String
- **Associations**:
    - LynkPaymentDetails: 1..1 User (composite)

---

#### **Merchant**

- **Generalization**:
    - inherits from User
- **Attributes**:
    - -isCompliant: Boolean
    - -companyName: String
    - -companyAddress: String
    - -companyPhone: String
    - -verificationExpiresAt: DateTime?
- **Operations**:
    - +isCompliant(): Boolean
    - +getCompanyName(): String
    - +getCompanyAddress(): String
    - +getCompanyPhone(): String
    - +getVerificationExpiresAt(): DateTime?
    - +serialize(): String
    - +deserialize(stringified: String): Merchant
    - +Merchant(companyName: String, companyAddress, companyPhone: String)
- **Associations**:
    - 1..\* RefundCase (composite)
    - 1..1 RefundCase (composite)
    - 1..1 RefundCase (composite)

---

#### **MerchantController**

- **Dependencies**:
    - uses Session
    - uses CreateMerchantDetailsDto
    - uses UpdateSelfMerchantDetails
    - uses DTO

---

#### **MerchantService**

- **Associations**:
    - 1..1 UserService (shared)
    - 1..1 AuthService (shared)
    - 1..1 AdminService (shared)
- **Dependencies**:
    - uses CreateMerchantDetailsDto
    - uses DTO

---

#### **Order**

- **Attributes**:
    - -grandTotal: Integer
    - -/isRefunded: Boolean
- **Operations**:
    - +Order(grandTotal: Integer): Order
    - +setPayment(payment: Transaction)
    - +getOrderID(): String
    - +getOrderStatus(): String
    - +updateOrderStatus(newStatus: String)
    - +getOrderItems(): List<AbstractOrderItem>
    - +getCustomerDetails(): Customer
    - +getMerchantDetails(): Merchant
    - +getPaymentDetails(): Transaction
    - +getShippingDetails(): String
    - +getServiceDate(): ScheduledDate?
    - +canCancel(): Boolean
    - +requestCancellation()
    - +canRequestRefund(): Boolean
    - +requestRefund()
    - +addOrderItem(item: AbstractOrderItem)
    - +sendOrderConfirmation()
    - +getTransactions(): List<Transaction>
    - +serialize(): String
    - +deserialize(stringified: String): Order
- **Associations**:
    - CustomerOrder: 1..1 Customer (shared)
    - 0..1 RefundCase (composite)
    - 1..1 Transaction (composite)
- **Realizations**:
    - implements Serializable

---

#### **PayPalPaymentDetails**

- **Generalization**:
    - inherits from AbstractPaymentDetails
- **Attributes**:
    - +email: String
- **Associations**:
    - PayPalPaymentDetails: 1..1 User (composite)

---

#### **PaymentController**

- **Operations**:
    - +execute(req: HttpRequest): HttpResponse

---

#### **PaymentResponse**

- **Attributes**:
    - -status: PaymentStatus
- **Operations**:
    - +getStatus(): PaymentStatus

---

#### **PaymentService**

- **Operations**:
    - +pay(items: List<AbstractCartProduct>, gateway: AbstractPaymentGateway)
- **Associations**:
    - 1..1 ProductService (shared)
    - 1..1 OrderService (shared)
    - 1..1 MerchantService (shared)
    - 1..1 CustomerService (shared)

---

#### **PaymentStatus**

- **Stereotype**: enumeration
- **Literals**:
    - Completed
    - Declined
    - Partially-Refunded
    - Pending
    - Refunded
    - Failed

---

#### **Permission**

- **Stereotype**: enumeration
- **Literals**:
    - SELL_PRODUCTS

---

#### **Product**

- **Generalization**:
    - ServiceProduct inherits from this class
- **Attributes**:
    - -price: Integer
    - -name: String
    - -shortDescription: String
    - -longDescription: String
    - -refundable: Boolean
    - -currentStock: Integer?
    - -visible: Boolean
- **Operations**:
    - +Product(price: Integer, name: String, shortDesc: String, longDesc: String, refundable: Boolean, currentStock: Integer?, visible: Boolean): Product
    - +updatePrice(newPrice: Integer)
    - +updateShortDescription(newDesc: String)
    - +updateLongDescription(newDesc: String)
    - +updateStock(quantityChange: Integer)
    - +setVisibility(newVisibility: Boolean)
    - +isRefundable(): Boolean
    - +addTag(tag: ProductTag)
    - +removeTag(tag: ProductTag)
    - +addMedia(media: ProductMedia)
    - +removeMedia(media: ProductMedia)
    - +checkStockAvailability(requestedAvailability: Boolean): Boolean
    - +getMerchant(): Merchant
    - +serialize(): String
    - +deserialize(stringified: String): Product
- **Associations**:
    - MerchantProducts: 1..1 Merchant (composite)
    - 1..1 ProductCatalogue (composite)
    - 1..1 RefundCase (shared)
    - 0..\* Cart (shared)
    - 0..\* Order (shared)
- **Realizations**:
    - implements Serializable

---

#### **ProductCatalogue**

- **Operations**:
    - +loadMore(): Product[0..*]
    - +hasMore(): Boolean
- **Associations**:
    - VisibleProducts: 0..\* Product (shared)

---

#### **ProductController**

- **Operations**:
    - +execute(req: HttpRequest): HttpResponse
    - -addProduct(req: HttpRequest, dto: DTO)
    - -updateProduct(req: HttpRequest, dto: DTO)

---

#### **ProductMedia**

- **Attributes**:
    - -objectKey: String
    - -url: String
    - -mediaType: String
- **Operations**:
    - +getObjectKey(): String
    - +getMediaURL(): String
    - +getMediaType(): String
- **Associations**:
    - ProductMedia: 1..1 Product (composite)

---

#### **ProductService**

- **Operations**:
    - +addProduct(dto: DTO): Product
    - +updateProduct(dto: DTO): Product
    - +deleteProduct(productId: String)

---

#### **ProductTag**

- **Attributes**:
    - -tag: String
- **Operations**:
    - +getTagName(): String
    - +updateTagName(newName: String)
- **Associations**:
    - ProductTags: 1..1 Product (composite)

---

#### **RefundCase**

- **Attributes**:
    - -id: String {id}
    - -status: RefundStatus
    - +reason: String
    - -createdAt: DateTime
    - -resolvedAt: DateTime?
- **Operations**:
    - +RefundCase(reason: String, merchant: Merchant, customer: Customer)
    - +getCaseID(): String
    - +getOrder(): Order
    - +getCustomer(): Customer
    - +getMerchant(): Merchant
    - +addMessage(message: RefundMessage)
    - +getMessages(): List<RefundMessage>
    - +updateStatus(newStatus: RefundStatus, adminUser: Administrator)
    - +getCreationDate(): DateTime
    - +getResolutionDate(): DateTime?
    - +getReasonForRequest(): String
    - +serialize(): String
    - +deserialize(stringified: String): RefundCase
- **Associations**:
    - RefundCaseOwner: 1..1 Customer (composite)
    - RefundOrder: 1..1 Order
    - RefundCaseParticipants: 0..\* Role
    - \*..1 Product (shared)
- **Realizations**:
    - implements Serializable

---

#### **RefundMessage**

- **Attributes**:
    - -message: String
    - -timestamp: DateTime
- **Operations**:
    - +getMessageContent(): String
    - +getSender(): User
    - +getTimestamp(): DateTime
    - +serialize(): String
    - +deserialize(stringified: String): RefundMessage
- **Associations**:
    - RefundCaseMessages: 1..1 RefundCase (composite)
    - SentRefundCaseMessages: 1..1 Role (shared)
- **Realizations**:
    - implements Serializable

---

#### **RefundStatus**

- **Stereotype**: enumeration
- **Literals**:
    - PENDING
    - REJECTED
    - APPROVED

---

#### **Role**

- **Attributes**:
    - -permissions: Permission[0..*]
- **Operations**:
    - +serialize(): String
    - +deserialize(stringified: String): Role
- **Associations**:
    - RoleHierarchy: 0..\* Role
    - UserRole: 1..1 User (composite)
    - 1..1 Cart (composite)
- **Realizations**:
    - implements Serializable

---

#### **Router**

- **Operations**:
    - +match(req: HttpRequest): IRoute
- **Associations**:
    - Router: 1..1 Logger (composite)
    - ConnectionHandler: 0..\* ConnectionHandler

---

#### **S3**

- **Generalization**:
    - inherits from FileService
- **Operations**:
    - +createBucket(req: Object): Object
    - +deleteBucket(req: Object): Object
    - +deleteObject(req: Object): Object
    - +deleteObjects(req: Object): Object
    - +getObject(req: Object): Object
    - +getObjectAsBytes(req: Object): Object
    - +headObject(req: Object): Object
    - +listBuckets(req: Object): Object
    - +listObjectsV2(req: Object): Object
    - +putObject(req: Object): Object
    - +uploadPart(req: Object, body: Object): Object

---

#### **ScheduledDate**

- **Attributes**:
    - -startDate: DateTime
    - -endDate: DateTime
    - -confirmed: Boolean
- **Operations**:
    - +getStartDate(): DateTime
    - +getEndDate(): DateTime
    - +setPeriod(start: DateTime, end: DateTime)
    - +getDuration(): String
    - +isConfirmed(): Boolean
- **Associations**:
    - OrderDates: 1..1 Order (composite)
    - ScheduledDates: 1..1 ServiceProduct

---

#### **Serializable**

- **Stereotype**: interface
- **Operations**:
    - +serialize(): String
    - +deserialize(stringified: String): Serializable

---

#### **ServiceCartItem**

- **Generalization**:
    - inherits from AbstractCartProduct
- **Attributes**:
    - -scheduledDate: DateTime?
- **Operations**:
    - +getScheduledDate(): DateTime?
    - +setScheduledDate(date: DateTime?)
    - +isDateConfirmed(): Boolean

---

#### **ServiceOrderItem**

- **Generalization**:
    - inherits from AbstractOrderItem
- **Attributes**:
    - -scheduledDate: DateTime?
    - -deposit: Integer?
- **Operations**:
    - +getScheduledDate(): DateTime?

---

#### **ServiceProduct**

- **Generalization**:
    - inherits from Product
- **Attributes**:
    - -appointmentRequired: Boolean
    - -deposit: Integer?
- **Operations**:
    - +setDepositPercentage(percent: Float)
    - +serialize(): String
    - +deserialize(stringified: String): ServiceProduct

---

#### **Session**

- **Attributes**:
    - -id: String {id}
    - -ttl: Integer
    - -createdAt: DateTime
- **Operations**:
    - +revokeSession()
    - +getId(): String
    - +getTTL(): Integer
    - +getCreatedAt(): DateTime
    - +isAlive(): Boolean
    - +serialize(): String
    - +deserialize(stringified: String): Session
- **Associations**:
    - SessionRoles: 0..\* Role
- **Realizations**:
    - implements Serializable

---

#### **Time**

- **Stereotype**: dataType
- **Operations**:
    - +Time(hour: Integer, minute: Integer, seconds: Integer)
    - +isAfter(k: Time): Boolean
    - +add(k: Time): Time
    - +subtract(k: Time): Time
    - +asNumber(): Integer
    - +now(): Time

---

#### **Transaction**

- **Attributes**:
    - -amount: Integer
    - -timestamp: DateTime
- **Operations**:
    - +Transaction(order: Order, amount: Integer): Transaction
    - +getTransactionAmount(): Integer
    - +getTransactionTimestamp(): DateTime
    - +getPaymentGatewayReference(): String
- **Associations**:
    - OrderPayment: 1..1 Order (composite)
- **Realizations**:
    - implements Serializable

---

#### **User**

- **Attributes**:
    - -username: String
    - -email: String
    - -passwordHash: String
    - -firstName: String
    - -lastName: String
    - -acceptedTermsAndPrivacy: Boolean
    - -eSignature: String
    - -policiesAcceptedAt: DateTime
    - +banned: Boolean
    - +bannedUntil: DateTime?
    - +bannedReason: String?
- **Operations**:
    - +getUsername(): String
    - +getEmail(): String
    - +getPasswordHash(): String
    - +getFirstName(): String
    - +getLastName(): String
    - +hasAcceptedPolicies(): Boolean
    - +getESignature(): String
    - +getPoliciesAcceptedDateTime(): DateTime
    - +isBanned(): Boolean
    - +getBannedUntil(): DateTime?
    - +getBannedReason(): String
    - +serialize(): String
    - +deserialize(stringified: String): User
- **Associations**:
    - UserRole: 0..\* Role (composite)
    - VisibleCatalogue: 1..1 ProductCatalogue
    - UserSessions: 1..1 Session (composite)
- **Realizations**:
    - implements Serializable

---

#### **UserController**

- **Generalization**:
    - inherits from Controller
- **Operations**:
    - +execute(req: HttpRequest): HttpResponse
    - -getSelf(req: HttpRequest): HttpResponse
    - -getUserById(req: HttpRequest): HttpResponse
    - -createUser(req: HttpRequest, dto: DTO): HttpResponse
    - -updateSelf(req: HttpRequest, dto: DTO): HttpResponse
    - -deleteSelf(req: HttpRequest): HttpResponse
    - -uploadLetterOfGoodStanding(req: HttpRequest): HttpResponse
    - -getLettersOfGoodStanding(req: HttpRequest): HttpResponse
- **Associations**:
    - UserService: 1..1 UserService (shared)
- **Dependencies**:
    - uses CreateUserDto
    - uses UpdateSelfDto
    - uses Session
    - uses CreateSelfCustomerDetails
    - uses UpdateSelfCustomerDetails
    - uses DTO

---

#### **UserService**

- **Operations**:
    - +getUserById(userId: String): User
    - +createUser(dto: DTO): User
    - +updateUser(userId: String, dto: DTO): User
    - +deleteUser(userId: String): User
    - +uploadLetterOfGoodStanding(letter: File)
    - +getLettersOfGoodStanding(): List<LetterOfGoodStanding>
- **Associations**:
    - Users: 0..\* User
    - UserController: 1..1 UserController (shared)
    - AuthService: 1..1 AuthService (shared)
    - 1..1 AdminService (shared)
    - 1..1 MerchantService (shared)
    - 1..1 AdminController (shared)
- **Dependencies**:
    - creates User
    - uses CreateUserDto
    - uses UpdateUserDto
    - uses GetUserDto
    - uses DeleteUserDto
    - uses CreateCustomerDetailsDto
    - uses UpdateCustomerDetailsDto
    - uses DTO
    - uses Logger
    - uses CreateMerchantDetailsDto

---
