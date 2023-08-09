export interface IBid {
    id?: string;
    bidder_id?: string;
    product_id?: string;
    price?: number;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBidUsecase {
    create(IBid, bidderId: string): Promise<IBid>;
}

export interface IBidRepo {
    create(queryRunner, IBid): Promise<IBid>;
    list(queryRunner, status: string, productId: string): Promise<IBid[]>;
    update(queryRunner, IBid): Promise<void>;
    updateByProductId(QueryRunner, IBid): Promise<void>
}
