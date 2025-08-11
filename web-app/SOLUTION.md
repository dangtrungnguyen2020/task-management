BÀI TEST FULLSTACK - SENIOR DEVELOPER

# PHẦN 3 – XỬ LÝ TÌNH HUỐNG KỸ THUẬT (20 điểm)

Viết trả lời vào file SOLUTION.md

## Câu 1 (10 điểm):

Giả sử hệ thống đang có lượng lớn request đồng thời tạo task cùng lúc. Đề xuất kiến trúc hệ thống backend và database để đảm bảo hiệu năng và tính sẵn sàng.

### Trả lời:

Một kiến trúc hệ thống backend và database hiệu quả để xử lý lượng lớn request đồng thời tạo task cần tập trung vào việc phân tách các tác vụ, sử dụng các công nghệ bất đồng bộ, và đảm bảo tính sẵn sàng cao. Dưới đây là đề xuất kiến trúc cụ thể:

### Kiến trúc Backend

---

Để xử lý request đồng thời, chúng ta nên áp dụng mô hình kiến trúc Microservices hoặc Service-Oriented Architecture (SOA). Điều này giúp chia nhỏ hệ thống thành các dịch vụ độc lập, dễ quản lý và mở rộng.

#### 1\. Cổng API (API Gateway)

Cổng API sẽ là điểm truy cập duy nhất cho tất cả các request từ client. Nó có nhiệm vụ:

- Xác thực và ủy quyền: Đảm bảo chỉ những request hợp lệ mới được xử lý.
- Định tuyến request: Chuyển request đến các service backend phù hợp.
- Giới hạn tỷ lệ (Rate Limiting): Ngăn chặn các cuộc tấn công DDoS và đảm bảo hệ thống không bị quá tải.

#### 2\. Message Queue (hàng đợi)

Đây là giải pháp siêu mạnh để xử lý lượng lớn request bất đồng bộ. Thay vì xử lý request ngay lập tức, server sẽ:

- Nhận request từ client.
- Ghi task vào hàng đợi thông điệp (ví dụ: RabbitMQ, Apache Kafka).
- Gửi lại phản hồi "thành công" ngay lập tức cho client.

Hàng đợi thông điệp sẽ giúp:

- Giảm tải cho backend: Các request không cần phải chờ đợi để được xử lý, server chỉ cần nhận và ghi vào hàng đợi.
- Đảm bảo độ tin cậy: Nếu một backend service bị lỗi, các task vẫn còn trong hàng đợi và sẽ được xử lý khi service hoạt động trở lại.

#### 3\. Dịch vụ xử lý task (Task Processing Service)

Đây là các worker độc lập, lắng nghe hàng đợi thông điệp và xử lý từng task một. Chúng ta có thể chạy nhiều instance của dịch vụ này để xử lý task song song.

- Tính toán song song: Mỗi worker có thể xử lý một task riêng biệt, tối đa hóa hiệu suất.
- Khả năng mở rộng: Dễ dàng thêm hoặc bớt các worker tùy theo lượng task trong hàng đợi.

#### 4\. Các dịch vụ chống tấn công khác:

- Rate Limiting: giới hạn số lượng request gửi đến liên tục trong một thời gian xác định. Khi vượt ngưỡng cho phép, dịch vụ có thể tứ chối và trả lỗi về cho client ngay lập tức mà không cần phải thực thi nghiệp vụ
- Circuit breaker (ngắt mạch) là một mẫu thiết kế (design pattern) trong lập trình, được sử dụng để tăng tính ổn định và đàn hồi (resilience) cho các ứng dụng. Nó hoạt động như một "cầu dao điện" trong hệ thống, giúp ngăn chặn các lỗi nhỏ từ việc lan truyền và gây sụp đổ toàn bộ hệ thống.

### Kiến trúc Database

---

Để đảm bảo hiệu năng và tính sẵn sàng, chúng ta không nên sử dụng một database duy nhất cho tất cả các tác vụ.

#### 1\. Database cho trạng thái tác vụ (Task State Database)

- Công nghệ: Sử dụng NoSQL database như MongoDB hoặc Cassandra vì chúng rất phù hợp cho việc ghi và đọc dữ liệu không đồng nhất và có khả năng mở rộng tốt.
- Mục đích: Lưu trữ trạng thái của các task (ví dụ: pending, in_progress, completed, failed).

#### 2\. Database cho dữ liệu chính (Main Database)

- Công nghệ: Tùy thuộc vào yêu cầu của ứng dụng. Có thể sử dụng SQL database (như PostgreSQL, MySQL) nếu dữ liệu có cấu trúc chặt chẽ và cần tính toàn vẹn cao.
- Mục đích: Lưu trữ các dữ liệu quan trọng của ứng dụng (ví dụ: thông tin người dùng, sản phẩm...). Dữ liệu này không cần phải được cập nhật thường xuyên từ các task.

#### 3\. Bộ nhớ đệm (Caching)

Sử dụng Redis hoặc Memcached để lưu trữ các dữ liệu thường xuyên được truy cập.

- Mục đích: Giảm tải cho các database chính bằng cách phục vụ các request đọc từ bộ nhớ đệm, giúp tăng tốc độ phản hồi.

### Sơ đồ kiến trúc tổng quan

Sơ đồ trên minh họa luồng xử lý:

1.  Client gửi request đến API Gateway.
2.  API Gateway xác thực và chuyển request đến Backend Service phù hợp.
3.  Backend Service xử lý các nghiệp vụ, gọi request qua các service khác để cập nhật hoặc bộ sung dữ liệu, tạo một task và ghi vào Message Queue rồi trả về trạng thái thành công cho client.
4.  Task Processing Service lấy task từ Message Queue, xử lý và cập nhật trạng thái vào Task State Database, hoặc gửi thông báo đến client (thông báo xác thực).
5.  Client có thể nhận response trực tiếp từ server hoặc kiểm tra trạng thái task qua thông báo từ Message Queue.

## Câu 2 (10 điểm):

Dự án frontend sử dụng React, khi fetch API gặp lỗi:  
"CORS policy: No 'Access-Control-Allow-Origin' header".  
Hãy giải thích nguyên nhân và cách khắc phục trong:  
\- Local development  
\- Production deployment

### Trả lời:

Lỗi "CORS policy: No 'Access-Control-Allow-Origin' header" xảy ra khi trình duyệt chặn request từ một trang web (frontend) đến một tài nguyên (backend API) ở một domain, port hoặc protocol khác. Đây là một cơ chế bảo mật của trình duyệt để ngăn chặn các cuộc tấn công CSRF (Cross-Site Request Forgery).

Nguyên nhân chính là server backend không gửi kèm header **`Access-Control-Allow-Origin`** trong response, hoặc giá trị của header này không khớp với origin của frontend.

### Khắc phục trong Local Development

Trong môi trường local, bạn có thể khắc phục bằng cách sử dụng **proxy** để chuyển tiếp request từ frontend sang backend.

1.  **Sử dụng `proxy` trong `package.json`**: Đối với các dự án tạo bằng Create React App (CRA), bạn chỉ cần thêm dòng sau vào file `package.json`:

    JSON

    ```
    "proxy": "http://localhost:5000"
    ```

    (Thay `http://localhost:5000` bằng địa chỉ của backend API). Khi đó, các request đến `/api` từ frontend sẽ được tự động chuyển tiếp đến backend mà không bị chặn bởi CORS.

2.  **Sử dụng Middleware Proxy**: Nếu bạn không dùng CRA, bạn có thể thiết lập proxy bằng các công cụ như `http-proxy-middleware`.

### Khắc phục trong Production Deployment

Trong môi trường production, cách duy nhất và an toàn nhất là cấu hình **backend server** để cho phép các request từ domain của frontend.

1.  **Cấu hình CORS trong Backend**:

    - **Thêm Middleware CORS**: Hầu hết các framework backend đều có sẵn middleware để xử lý CORS.
      - **Node.js (Nest.js)**: Sử dụng package `cors`.
        JavaScript

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Main", { timestamp: true });
  const globalPrefix = "/api";

  app.enableCors({
    origin: [
      "http://localhost:3000", // Example: your frontend running on localhost
      "https://www.your-allowed-domain.com", // Example: your production domain
      "https://another-allowed-domain.org", // Example: another allowed domain
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow sending cookies/authorization headers
  });
  app.setGlobalPrefix(globalPrefix);
  // Some other pipeline or filter

  await app.listen(AppModule.port);

  // Log current url of app
  let baseUrl = app.getHttpServer().address().address;
  if (baseUrl === "0.0.0.0" || baseUrl === "::") {
    baseUrl = "localhost";
  }
  logger.log(`Listening to http://${baseUrl}:${AppModule.port}${globalPrefix}`);
  if (AppModule.isDev) {
    logger.log(
      `Swagger UI: http://${baseUrl}:${AppModule.port}${globalPrefix}/docs`
    );
  }
}
bootstrap();
```

2.  Cấu hình Web Server (Nginx/Apache):

    Bạn có thể thêm header CORS trực tiếp vào cấu hình của web server (Nginx hoặc Apache) để server tự động thêm header Access-Control-Allow-Origin vào các response.

    - **Nginx**:
      Nginx

    ```
    location / {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:3000';
    # ...các cấu hình khác
    }
    ```

    - **Apache**:
      Apache

    ```
    <Directory /path/to/your/backend>
    Header set Access-Control-Allow-Origin "http://localhost:3000"
    </Directory>
    ```

**Lưu ý thêm**:

- Trong production, **chỉ nên cho phép domain của frontend** thay vì cho phép tất cả (`*`) để đảm bảo tính bảo mật.
- Bạn cũng cần cấu hình các header CORS khác như `Access-Control-Allow-Methods` và `Access-Control-Allow-Headers` để cho phép các method (GET, POST,...) và các header tùy chỉnh (Authorization, Content-Type,...) mà frontend sử dụng.
