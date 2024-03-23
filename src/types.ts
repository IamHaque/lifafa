export interface Lifafa {
  _id: string;
  count: number;
  message?: string;
  createdBy: string;
  createdAt: string;
  remaining: number;
  errorMessage?: string;
  initialAmount: number;
  claimedAmount: number;
  remainingAmount: number;
}
