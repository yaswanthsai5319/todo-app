import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoTaskList } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoTaskList])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
