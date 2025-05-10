import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => User, (user: any) => user.categories, { eager: false, nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
