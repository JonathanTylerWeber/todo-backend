import { Request, Response } from "express";
import * as TodoService from "../services/todoService";

export const createTodoHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    // Ensure userId is defined
    const userId = req.userId;
    if (typeof userId !== 'number') {
      res.status(401).send("Unauthorized: Invalid user ID");
      return;
    }

    const newTodo = await TodoService.createTodo(userId, title, description);
    res.status(200).json({ data: newTodo, message: "New Todo Created Successfully!!!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllTodosHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (typeof userId !== 'number') {
      res.status(401).send("Unauthorized: Invalid user ID");
      return;
    }

    const allTodos = await TodoService.getAllTodos(userId);
    res.status(200).json({ data: allTodos, message: "All Todos" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateTodoHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (typeof userId !== 'number') {
      res.status(401).send("Unauthorized: Invalid user ID");
      return;
    }

    const { id } = req.params;
    const { title, description } = req.body;

    await TodoService.updateTodo(parseInt(id), { title, description });
    res.status(200).send("Todo Updated Successfully!!!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteTodoHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (typeof userId !== 'number') {
      res.status(401).send("Unauthorized: Invalid user ID");
      return;
    }

    const todo_id = parseInt(req.params.id);
    await TodoService.deleteTodo(todo_id);
    res.status(200).send("Todo deleted successfully!!!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
