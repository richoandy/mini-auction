import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IBalanceHistory } from '../entity';

@Entity({ name: 'balance_history' })
export default class BalanceHistory extends BaseEntity implements IBalanceHistory {
    @PrimaryColumn()
    id?: string;

    @Column()
    user_id?: string;

    @Column()
    bid_id?: string;

    @Column()
    type?: string;

    @Column()
    amount?: number;

    @Column()
    previous_balance?: number;

    @Column()
    updated_balance?: number;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}