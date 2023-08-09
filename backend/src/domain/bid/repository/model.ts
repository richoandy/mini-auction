import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IBid } from '../entity';
import User from '../../user/repository/model';

@Entity({ name: 'bids' })
export default class Bid extends BaseEntity implements IBid {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    bidder_id: string;

    @Column()
    product_id: string;

    @Column()
    price: number;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @ManyToOne(() => User, user => user.bids)
    @JoinColumn({ name: 'bidder_id' })
    bidder?: User;
}