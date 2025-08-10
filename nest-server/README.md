# Phần 1 - Thiết kế và code backend

**Bài tóan:** Thiết kết RESTful API cho hệ thống quản lý công việc (Task Management).
Mỗi User có thể tạo nhiều Project, mỗi project chứa nhiều Task.

**Yêu cầu:**

- Viết bằng Java Spring Boot hoặc NestJS (Node.js).
- API cơ bản:
  - [POST] /users - Tạo người dùng
  - [POST] /projects - Tạo dự án (liên kết với ngưòi dùng)
  - [POST] /tasks - Tạo task (liên kết với project)
  - [GET] /users/{Id}/projects - Lấy danh sách project của user
  - [GET] /projects/{id}/tasks - Lấy danh sách task của project
  - Task có các trạng thái: Todo, In Progress, Done.
  - Áp dụng best practices: validation, error handling, logging, pagination.

**Bonus:**

- Tích hợp JWT authentication
- Tích hợp Swagger UI
