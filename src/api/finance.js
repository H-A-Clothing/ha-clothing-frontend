// Member 7: financial management and reporting APIs.
import { apiClient } from "./client";

export const listExpenses = (params) => apiClient.get("/expenses", params);
export const getExpense = (id) => apiClient.get(`/expenses/${id}`);
export const createExpense = (body) => apiClient.post("/expenses", body);
export const updateExpense = (id, body) => apiClient.patch(`/expenses/${id}`, body);
export const deleteExpense = (id) => apiClient.delete(`/expenses/${id}`);

export const listExpenseCategories = (params) => apiClient.get("/expenses/categories", params);
export const createExpenseCategory = (body) => apiClient.post("/expenses/categories", body);
export const removeExpenseCategory = (id) => apiClient.delete(`/expenses/categories/${id}`);
