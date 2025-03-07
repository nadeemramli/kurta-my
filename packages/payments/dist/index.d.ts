interface ChipServiceConfig {
    brand_id: string;
    api_key: string;
    is_sandbox?: boolean;
}
declare class ChipService {
    private brand_id;
    private api_key;
    private is_sandbox;
    constructor(config: ChipServiceConfig);
    createPayment(params: CreatePaymentParams): Promise<string>;
}
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

export { ChipService, type ChipServiceConfig, type CreatePaymentParams };
