import {
    Entity,
    Column,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { Verification } from './verification.entity';
import { AccountType, Language, Role } from 'enum';

@Entity('users')
export class User extends BaseEntity {
    @Column({ nullable: false })
    mobileNo: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    profile: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({
        type: 'enum',
        enum: Language,
        default: Language.ENGLISH,
    })
    language: Language;

    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.SMALL_SHOP,
    })
    type: AccountType;

    @Column({ nullable: true })
    userName: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    tableSize: string;

    @Column({ nullable: true })
    deviceToken: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.ADMIN,
    })
    role: Role;

    // Relations
    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];

    @OneToMany(() => Verification, (verification) => verification.user)
    verifications: Verification[];
}
