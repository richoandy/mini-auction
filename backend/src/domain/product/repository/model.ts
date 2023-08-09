import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IProduct } from 'domain/product/entity';
import User from '../../../domain/user/repository/model';

@Entity({ name: 'products' })
export default class Product extends BaseEntity implements IProduct {
    @PrimaryColumn()
    id?: string;

    @Column()
    seller_id?: string;

    @Column()
    name?: string;

    @Column()
    starting_price?: number;

    @Column()
    current_price?: number;

    @Column()
    is_available?: boolean;

    @Column()
    time_window?: number;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
    @ManyToOne(() => User, user => user.products)
    @JoinColumn({ name: 'seller_id' })
    seller?: User;
}

