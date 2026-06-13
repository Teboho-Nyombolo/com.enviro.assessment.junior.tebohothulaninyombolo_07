export interface DepositRequest {
  investmentId: number;
  amount: number;
}

export interface DepositResponse {
    id: number;
    investorId: number;
    investorName: string;
    investmentId: number;       // API sends this, not productId
    investmentName: string;      // API sends this, not productName
    amount: number;
    depositDate: string;
    status: string;
    reference: string;           // API sends this too
}

export interface ProductOption {
  productId: number;
  productName: string;
  productType: string;
}
