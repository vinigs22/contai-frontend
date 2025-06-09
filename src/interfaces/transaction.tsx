export interface Transaction {
    id: string;
    transactionDate: string;
    description: string;
    amount: number;
    paymentType: 'credit' | 'debit';
}

export type CreateTransaction = Omit<Transaction, 'id'>;

export interface Summary {
    total: number;
    credit: number;
    debit: number;
}