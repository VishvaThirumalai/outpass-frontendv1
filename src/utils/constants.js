// src/utils/constants.js
export const OUTPASS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  WARDEN: 'WARDEN',
  SECURITY: 'SECURITY',
  ADMIN: 'ADMIN'
};

export const STATUS_COLORS = {
  PENDING: '#ffc107',
  APPROVED: '#28a745',
  REJECTED: '#dc3545',
  ACTIVE: '#17a2b8',
  COMPLETED: '#6c757d',
  EXPIRED: '#fd7e14',
  CANCELLED: '#6c757d'
};

export const STATUS_LABELS = {
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ACTIVE: 'Currently Out',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ROUTES = {
  STUDENT: '/student',
  WARDEN: '/warden',
  SECURITY: '/security',
  LOGIN: '/login'
};

export const DATE_FORMAT = {
  FULL: 'MMMM DD, YYYY hh:mm A',
  DATE_ONLY: 'MMMM DD, YYYY',
  TIME_ONLY: 'hh:mm A'
};