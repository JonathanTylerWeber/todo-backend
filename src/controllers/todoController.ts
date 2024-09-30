import { Request, Response } from "express";
import * as TodoService from "../services/todoService";


export const createTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = req.body;
  const userId = req.userId as number;
  const newTodo = await TodoService.createTodo(userId, title, description);
  res.status(201).json({ data: newTodo, message: "New todo created successfully" });
};


export const getUserTodosHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const userTodos = await TodoService.getUserTodos(userId);
  res.status(200).json({ data: userTodos, message: "User Todos" });
};


export const updateTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description } = req.body;
  await TodoService.updateTodo(parseInt(id), { title, description });
  res.status(200).send("Todo updated successfully");
};


export const deleteTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const todo_id = parseInt(req.params.id);
  await TodoService.deleteTodo(todo_id);
  res.status(200).send("Todo deleted successfully");
};
