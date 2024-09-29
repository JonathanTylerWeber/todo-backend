import express, { Request, Response } from "express";
import { createUser, updateTodo, createTodo, deleteTodo, getAllTodos, checkUser } from "./db";
import jwt, { JwtPayload } from "jsonwebtoken";
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await createUser(username, email, password);
    const token = jwt.sign({ username: username, userId: newUser.id }, "#1234astra");

    res
      .status(200)
      .json({ message: "User Created Successfully!!!", token: token });
  }
  catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up" });
  }
});


app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const User = await checkUser(email, password);

    if (!User) {
      res.status(401).send("UnAuthorized !!!");
    }
    const token = jwt.sign({ email: email, userId: User?.id }, "#1234astra");
    res.status(200).json({ token: token, message: "Login Succesfully!!!" });


  }
  catch (error) {
    console.error(error);
    res.send(500).send("Internal Server Error");
  }


});

app.post("/todos", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodeToken = jwt.decode(token) as JwtPayload | null;
      const userId = decodeToken?.userId;
      const newTodo = await createTodo(userId, title, description);
      if (newTodo) {
        res.status(200).json({ data: newTodo, message: "New Todo Created Successfully!!!" });
      } else {
        res.status(409).send("Bad Request");
      }
    } else {
      res.status(401).send("Unauthorized: Token not provided");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await updateTodo(parseInt(id), { title, description });
    res.status(200).send("Todo Updated Successfully!!!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodeToken = jwt.decode(token) as JwtPayload | null;
      const userId = decodeToken?.userId;
      const allTodos = await getAllTodos(userId);
      if (allTodos && allTodos.length > 0) {
        res.status(200).json({ data: allTodos, message: "All Todos" });
        return;
      }
    }
    res.status(404).send("No Todos Found !!!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    debugger;
    const todo_id = parseInt(req.params.id);
    console.log(todo_id);
    const deleted = await deleteTodo(todo_id);
    if (deleted) {
      res.status(200).send("Todo deleted successfully!!!");
    }
  }
  catch (error) {
    console.error(error);
    res.send(500).send("Internal Server Error");

  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
