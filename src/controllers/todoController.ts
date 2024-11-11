// src/controllers/todoController.ts

import { Request, Response } from "express";
import * as TodoService from "../services/todoService";


export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = req.body;
  const userId = req.user?.id as number;
  const newTodo = await TodoService.createTodo(userId, title, description);
  res.status(201).json({ data: newTodo, message: "New todo created successfully" });
};


export const getUserTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id as number;
  const userTodos = await TodoService.getUserTodos(userId);
  res.status(200).json({ data: userTodos, message: "User Todos" });
};


export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description } = req.body;
  const updatedTodo = await TodoService.updateTodo(parseInt(id), { title, description });
  res.status(200).json({ data: updatedTodo, message: "Todo updated successfully" });
};


export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const todo_id = parseInt(req.params.id);
  await TodoService.deleteTodo(todo_id);
  res.status(200).send("Todo deleted successfully");
};
