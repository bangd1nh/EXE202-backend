class ApiResponse {
  // Phản hồi thành công
  static success(res, data = null, code = 200) {
    return res.status(code).json({
      success: true,
      data: data,
      message: 'Success', 
    });
  }

  // Phản hồi lỗi
  static error(res, code = 500, errors = null) {
    return res.status(code).json({
      success: false,
      message: 'Error',  
      errors: errors,
    });
  }

  static created(res, data = null) {
    return this.success(res, data, 201);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  // Phản hồi cấm truy cập (HTTP 403)
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, 403, message);
  }

  // Phản hồi không có quyền (HTTP 401)
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 401, message);
  }

  // Phản hồi lỗi xác thực (HTTP 422)
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, 422, { message, errors });
  }
}

export default ApiResponse;
