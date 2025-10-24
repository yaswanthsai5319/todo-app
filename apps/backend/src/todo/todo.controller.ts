import { Controller, Post, Get, Body, Put, Param } from '@nestjs/common';
import { In } from 'typeorm';
import { TodoService } from './todo.service';
import { TodoTaskList } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
    constructor(
        private readonly todoService: TodoService,
    ) {}

    @Get()
    async getAllTodos() : Promise<TodoTaskList[]> {
        return this.todoService.getAllTodos();
    }

    @Get(':id')
    async getTodoById(@Param('id') id: number) : Promise<TodoTaskList> {
        return this.todoService.findOne(id);
    }

    @Post()
    async createTodo(@Body() body: { title: string; description?: string }):Promise<TodoTaskList> {
        return this.todoService.createTodo(body.title, body.description);
    }

    @Put(':id')
    async updateTodo(
        @Param('id') id: number,
        @Body() body: Partial<TodoTaskList>,
    ): Promise<TodoTaskList> {
        return this.todoService.update(id, body);
    }

    @Put(':id/toggle')
    async toggleComplete(@Param('id') id: number): Promise<TodoTaskList> {
        return this.todoService.toggleComplete(id);
    }

    @Put(':id/delete')
    async deleteTodo(@Param('id') id: number): Promise<{ message: string }> {
        await this.todoService.deleteTodo(id);
        return { message: `Todo with ID ${id} has been deleted.` };
    }


}
