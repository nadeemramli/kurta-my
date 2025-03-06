interface CreatePaymentParams {
    product: {
        name: string;
        price: number;
    };
    client: {
        email: string;
        full_name?: string;
        phone_number?: string;
    };
    reference?: string;
}
declare function createPayment(params: CreatePaymentParams): Promise<string>;

export { type CreatePaymentParams, createPayment };
