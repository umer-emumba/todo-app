import { CreateUserDto, LoginDto } from "../../interfaces";
import { userRepository } from "../../repositories";
import { QueueService, authService } from "../../services";
import {
  ACCOUNT_CREATED,
  BadRequestError,
  UnauthorizedError,
  comparePasswords,
  generateJWT,
  hashPassword,
} from "../../utils";

jest.mock("../../services/queue.service.ts");
jest.mock("../../repositories/user.repository.ts");
jest.mock("../../utils/helper.ts");

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup method", () => {
    it("should return account created", async () => {
      const dto: CreateUserDto = {
        email: "test@test.com",
        password: "12345678",
      };
      const user = {
        id: 1,
        email: dto.email,
      };
      const token = "mockedtoken";
      (hashPassword as jest.Mock).mockResolvedValueOnce("hashedPassword");
      (userRepository.create as jest.Mock).mockResolvedValueOnce(user);
      (generateJWT as jest.Mock).mockReturnValueOnce(token);
      (QueueService.prototype.getQueue as jest.Mock).mockReturnValueOnce({
        add: jest.fn(),
      });

      const result = await authService.signup(dto);
      expect(result).toBe(ACCOUNT_CREATED);
    });
  });

  describe("signin method", () => {
    it("should throw UnauthorizedError if user is not found", async () => {
      const dto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };

      (userRepository.findByEmailUnscoped as jest.Mock).mockResolvedValueOnce(
        null
      );

      await expect(authService.signin(dto)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if user has social media token", async () => {
      const dto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };

      (userRepository.findByEmailUnscoped as jest.Mock).mockResolvedValueOnce({
        social_media_token: "token",
      });

      await expect(authService.signin(dto)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if password is invalid", async () => {
      const dto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };

      (userRepository.findByEmailUnscoped as jest.Mock).mockResolvedValueOnce(
        dto
      );
      (comparePasswords as jest.Mock).mockResolvedValueOnce(false); // Mock invalid password
      await expect(authService.signin(dto)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw BadRequestError if user email is not verified", async () => {
      const dto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };

      (userRepository.findByEmailUnscoped as jest.Mock).mockResolvedValueOnce({
        ...dto,
        email_verified_at: null,
      }); // Mock user found with email not verified
      (comparePasswords as jest.Mock).mockResolvedValueOnce(true); // Mock valid password

      await expect(authService.signin(dto)).rejects.toThrow(BadRequestError);
    });

    it("should return login response if user is found, password is valid, and email is verified", async () => {
      const dto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };
      const mockLoginResponse = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      jest
        .spyOn(authService, "generateTokenForLogin")
        .mockReturnValue(mockLoginResponse); //we use spy so that we dont want to mock our whole authservice

      (userRepository.findByEmailUnscoped as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...dto,
        email_verified_at: new Date(),
      }); // Mock user found with email verified
      (comparePasswords as jest.Mock).mockResolvedValueOnce(true); // Mock valid password

      const response = await authService.signin(dto);
      expect(response).toEqual(mockLoginResponse);
    });
  });
});
