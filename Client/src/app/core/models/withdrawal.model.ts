export interface WithdrawalRequest {
  investmentId: number;
  amount: number;
}

export interface WithdrawalResponse {
    id: number;
    investorId: number;
    investorName: string;
    investmentId: number;
    investmentName: string;
    amount: number;
    withdrawalDate: string;
    status: string;
    reference?: string;
    maxWithdrawalAmount?: number;
    withdrawalPercentage?: number;
    remainingBalance?: number;
}

export interface WithdrawalHistory {
  id: number;
  investmentName: string;  // Change from productName
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
