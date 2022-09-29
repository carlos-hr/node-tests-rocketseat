import "reflect-metadata";

import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("User features", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should be able to sign in an user", async () => {
    const user = await authenticateUserUseCase.execute({
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user).toHaveProperty("token");
  });

  it("Should be able to find user by id", async () => {
    const {
      user: { id },
    } = await authenticateUserUseCase.execute({
      email: "teste@teste.com",
      password: "123456",
    });

    const user = await showUserProfileUseCase.execute(id!);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("password");
  });
});
