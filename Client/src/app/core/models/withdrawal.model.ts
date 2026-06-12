export interface WithdrawalRequest {
  investmentId: number;
  amount: number;
}

export interface WithdrawalResponse {
  id: number;
  investorId: number;
  investorName: string;
  productId: number;
  productName: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  withdrawalDate: string;
  status: string;
  reference?: string;
  createdAt?: string;
}

export interface WithdrawalHistory {
  id: number;
  productName: string;
  amount: number;
  withdrawalDate: string;
  status: string;
  createdAt?: string;
}

export interface CsvExportRequest {
  investorId: number;
  productId?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
}
