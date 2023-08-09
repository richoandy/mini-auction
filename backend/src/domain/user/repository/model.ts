import { Entity, Column, BaseEntity, OneToMany, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from 'domain/user/entity';
import Product from '../../../domain/product/repository/model';
import Bid from '../../../domain/bid/repository/model';

@Entity({ name: 'users' })
export default class User extends BaseEntity implements IUser {
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    password?: string;

    @Column()
    balance?: number;

    @Column()
    last_bid_at?: Date;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    // Define the one-to-many relationship with Product
    @OneToMany(() => Product, product => product.seller)
    products: Product[];

    @OneToMany(() => Bid, bid => bid.bidder_id)
    bids: Bid[];
}

