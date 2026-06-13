// src/app/core/models/product.model.ts
export interface Product {
    productId: number;
    id: number;
    productName: string;
    productType: string;
    currentBalance: number;      // API sends this, not "balance"
    initialDeposit: number;     // Add this too since API sends it
    availableForWithdrawal: number;  // Add this too
    maxWithdrawalAmount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Portfolio {
    investorId: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    totalBalance: number;
    totalAvailableForWithdrawal: number;
    products?: Product[];
    age: number;
}
