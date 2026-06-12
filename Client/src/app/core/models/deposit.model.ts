export interface DepositRequest {
  investmentId: number;
  amount: number;
}

export interface DepositResponse {
  id: number;
  investorId: number;
  investorName: string;
  productId: number;
  productName: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  depositDate: string;
  status: string;
  message: string;
}

export interface ProductOption {
  productId: number;
  productName: string;
  productType: string;
}
