import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('todo_task_list')
export class TodoTaskList {

    @PrimaryGeneratedColumn()
    id;

    @Column()
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({default: false})
    isCompleted: boolean;

    @Column({default: false})
    isDeleted: boolean;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}