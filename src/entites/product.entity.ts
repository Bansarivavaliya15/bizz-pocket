import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity('products')
export class Product extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', default: 0 })
    price: number;

    @Column("text", { array: true, nullable: true })
    attachments: string[];

    @ManyToOne(() => Category, (category: any) => category.products, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => User, (user: any) => user.products, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
