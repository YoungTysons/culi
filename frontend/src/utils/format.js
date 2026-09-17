export const amount = (text) => Number(String(text || "").replace(/\D/g, ""));

export const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;
