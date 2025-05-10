import {
    Entity,
    Column,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('shop')
export class Shop extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => User, (user: any) => user.shops, { eager: false, nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: "user_id" })
    userId: string;
}
