import express, { Response, Request } from "express";
const app = express();
const port = 3000;

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
