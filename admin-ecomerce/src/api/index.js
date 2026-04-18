const BASE_URL = 'https://jewelry-backend-xi.vercel.app';

const getToken = () => localStorage.getItem('adminToken');

const headers = (isJson = true) => {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (isJson) h['Content-Type'] = 'application/json';
  return h;
};

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
};

// AUTH
export const loginApi = (email, password) =>
  fetch(`${BASE_URL}/api/user/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleRes);

// ADMIN DASHBOARD
export const getDashboard = () =>
  fetch(`${BASE_URL}/api/admin/dashboard`, { headers: headers() }).then(handleRes);

export const getRevenueChart = (period = 'month') =>
  fetch(`${BASE_URL}/api/admin/revenue-chart?period=${period}`, { headers: headers() }).then(handleRes);

export const getTopProducts = () =>
  fetch(`${BASE_URL}/api/admin/top-products`, { headers: headers() }).then(handleRes);

export const getRecentOrders = () =>
  fetch(`${BASE_URL}/api/admin/recent-orders`, { headers: headers() }).then(handleRes);

export const getOrderStats = () =>
  fetch(`${BASE_URL}/api/admin/order-stats`, { headers: headers() }).then(handleRes);

export const getUserStats = () =>
  fetch(`${BASE_URL}/api/admin/user-stats`, { headers: headers() }).then(handleRes);

// USERS
export const getAllUsers = () =>
  fetch(`${BASE_URL}/api/user/get-all`, { headers: headers() }).then(handleRes);

export const deleteUser = (id) =>
  fetch(`${BASE_URL}/api/user/delete-user/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

export const deleteManyUsers = (ids) =>
  fetch(`${BASE_URL}/api/user/delete-many`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ ids }),
  }).then(handleRes);

// PRODUCTS
export const getAllProducts = (page = 0, limit = 10) =>
  fetch(`${BASE_URL}/api/product/get-all?page=${page}&limit=${limit}`, { headers: headers() }).then(handleRes);

export const createProduct = (data) =>
  fetch(`${BASE_URL}/api/product/create`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const updateProduct = (id, data) =>
  fetch(`${BASE_URL}/api/product/update/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const deleteProduct = (id) =>
  fetch(`${BASE_URL}/api/product/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

export const deleteManyProducts = (ids) =>
  fetch(`${BASE_URL}/api/product/delete-many`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ ids }),
  }).then(handleRes);

// ORDERS
export const getAllOrders = () =>
  fetch(`${BASE_URL}/api/order/get-all-order`, { headers: headers() }).then(handleRes);

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE_URL}/api/order/update-status/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify({ status }),
  }).then(handleRes);

export const getOrderDetails = (id) =>
  fetch(`${BASE_URL}/api/order/get-details-order/${id}`, { headers: headers() }).then(handleRes);

// CATEGORIES
export const getAllCategoriesAdmin = () =>
  fetch(`${BASE_URL}/api/category/admin/get-all`, { headers: headers() }).then(handleRes);

export const createCategory = (data) =>
  fetch(`${BASE_URL}/api/category/create`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const updateCategory = (id, data) =>
  fetch(`${BASE_URL}/api/category/update/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const deleteCategory = (id) =>
  fetch(`${BASE_URL}/api/category/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// POSTS
export const getAllPosts = (page = 0, limit = 20) =>
  fetch(`${BASE_URL}/api/post/get-all?page=${page}&limit=${limit}`, { headers: headers() }).then(handleRes);

export const createPost = (data) =>
  fetch(`${BASE_URL}/api/post/create`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const updatePost = (id, data) =>
  fetch(`${BASE_URL}/api/post/update/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const deletePost = (id) =>
  fetch(`${BASE_URL}/api/post/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// BANNERS
export const getAllBannersAdmin = () =>
  fetch(`${BASE_URL}/api/banner/admin/get-all`, { headers: headers() }).then(handleRes);

export const createBanner = (data) =>
  fetch(`${BASE_URL}/api/banner/create`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const updateBanner = (id, data) =>
  fetch(`${BASE_URL}/api/banner/update/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const deleteBanner = (id) =>
  fetch(`${BASE_URL}/api/banner/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// FEEDBACK
export const getAllFeedbacks = () =>
  fetch(`${BASE_URL}/api/feedback/get-all`, { headers: headers() }).then(handleRes);

export const getApprovedFeedbacks = (page = 0, limit = 10) =>
  fetch(`${BASE_URL}/api/feedback/get-approved?page=${page}&limit=${limit}`, { headers: headers() }).then(handleRes);

export const approveFeedback = (id) =>
  fetch(`${BASE_URL}/api/feedback/approve/${id}`, { method: 'PUT', headers: headers() }).then(handleRes);

export const deleteFeedback = (id) =>
  fetch(`${BASE_URL}/api/feedback/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// FEEDBACK ALBUM
export const getAllFeedbackAlbums = () =>
  fetch(`${BASE_URL}/api/feedback-album/admin/get-all`, { headers: headers() }).then(handleRes);

export const createFeedbackAlbum = (data) =>
  fetch(`${BASE_URL}/api/feedback-album/create`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const updateFeedbackAlbum = (id, data) =>
  fetch(`${BASE_URL}/api/feedback-album/update/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleRes);

export const deleteFeedbackAlbum = (id) =>
  fetch(`${BASE_URL}/api/feedback-album/delete/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// UPLOAD
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE_URL}/api/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  }).then(handleRes);
};
