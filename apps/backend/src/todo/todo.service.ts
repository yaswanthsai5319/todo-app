import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoTaskList } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(TodoTaskList)
        private todoRepository: Repository<TodoTaskList>,
    ) {}

    async createTodo(title: string, description?: string): Promise<TodoTaskList> {
        const newTodo = this.todoRepository.create({ title, description });
        return this.todoRepository.save(newTodo);
    }

    async getAllTodos(): Promise<TodoTaskList[]> {
        return this.todoRepository.find({where : {isDeleted: false}, order: { id: 'ASC' }});
    }

    async findOne(id: number): Promise<TodoTaskList> {
        const todo = await this.todoRepository.findOne({ 
            where: { id, isDeleted: false } 
        });
        
        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }
        
        return todo;
    }

    async update(id: number, data: Partial<TodoTaskList>): Promise<TodoTaskList> {
        data.updatedAt = new Date();
        await this.todoRepository.update(id, data);
        return this.findOne(id);
    }

    async toggleComplete(id: number): Promise<TodoTaskList> {
        const todo = await this.findOne(id);
        return this.update(id, { isCompleted: !todo.isCompleted });
    }

    async deleteTodo(id: number): Promise<void> {
        await this.findOne(id); 
        await this.todoRepository.update(id, { isDeleted: true });
    }
}
