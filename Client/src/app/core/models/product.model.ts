// src/app/core/models/product.model.ts
export interface Product {
  productId: number;
  id: number;
  productName: string;
  productType: string;
  balance: number;
  maxWithdrawalAmount: number;
}

export interface Portfolio {
  investorId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  products: Product[];
  totalBalance: number;
  totalAvailableForWithdrawal: number;
}
