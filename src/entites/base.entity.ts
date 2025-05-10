import {
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
