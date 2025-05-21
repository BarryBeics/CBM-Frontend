// auth/roleUtils.js
export const isAdmin = (role) => role === 'admin';
export const isMember = (role) => ['member', 'admin'].includes(role);
