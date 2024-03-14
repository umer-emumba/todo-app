import { CreateTaskDto, TaskType } from "../../interfaces";
import { Task, User } from "../../models";
import { taskRepository } from "../../repositories";
import { QueueService, taskService } from "../../services";
import {
  CREATED_SUCCESSFULLY,
  config,
  createAndSaveTemplate,
} from "../../utils";

jest.mock("./../../repositories/task.repository.ts");
jest.mock("./../../services/queue.service.ts");
jest.mock("./../../utils/helper.ts");

describe("Task Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add task method", () => {
    it("should return task created successfully", async () => {
      const dto: CreateTaskDto = {
        title: "",
        html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>EJS File</title>
              </head>
              <body>
                <h1>Hello, <%=name%>!</h1>
                <p>You are <%=age%> years old.</p>
                <strong>random:<%=random%></strong>
              </body>
              </html>`,
        description: "trip planned for kalam",
        due_at: new Date(),
        task_type: TaskType.HTML,
      };

      const user: User = new User({
        id: 1,
        email: "test@test.com",
      });
      const template_url = "/templates/test.html";

      const task = new Task({
        id: 1,
        ...dto,
        user_id: user.id,
        template_url: template_url,
      });

      (createAndSaveTemplate as jest.Mock).mockResolvedValueOnce(template_url);
      (taskRepository.create as jest.Mock).mockResolvedValueOnce(task);
      (taskRepository.countById as jest.Mock).mockResolvedValueOnce(
        config.maxTaskCount - 1
      );
      (QueueService.prototype.getQueue as jest.Mock).mockReturnValueOnce({
        add: jest.fn(),
      });

      const response = await taskService.addTask(user, dto);
      expect(response).toBe(CREATED_SUCCESSFULLY("Task"));
    });
  });
});
