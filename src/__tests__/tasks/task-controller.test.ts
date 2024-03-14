import httpMocks from "node-mocks-http";
import { CreateTaskDto, TaskType } from "../../interfaces";
import { taskService } from "../../services";
import { CREATED_SUCCESSFULLY, createAndValidateDto } from "../../utils";
import { taskController } from "../../controllers";

jest.mock("../../services/task.service.ts");
jest.mock("../../utils/helper.ts");

describe("Task Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add task method", () => {
    it("should return status 201", async () => {
      const dto: CreateTaskDto = {
        title: "kalam trip plan",
        html: "",
        description: "trip planned for kalam",
        due_at: new Date(),
        task_type: TaskType.TEXT,
      };

      const user = {
        id: 1,
        email: "test@test.com",
      };

      const req = httpMocks.createRequest({
        user: {
          ...user,
        },
        body: {
          ...dto,
        },
      });
      const res = httpMocks.createResponse();

      (createAndValidateDto as jest.Mock).mockResolvedValueOnce(dto);
      (taskService.addTask as jest.Mock).mockResolvedValueOnce(
        CREATED_SUCCESSFULLY("Task")
      );
      await taskController.addTask(req, res);
      expect(res.statusCode).toBe(201);
    });
  });
});
