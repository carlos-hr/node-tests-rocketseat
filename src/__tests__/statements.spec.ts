import "reflect-metadata";

import { AuthenticateUserUseCase } from "../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../modules/statements/entities/Statement";
import { GetBalanceUseCase } from "../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Statements features", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to deposit on an user account", async () => {
    const { id } = await createUserUseCase.execute({
      name: "Statement test",
      email: "statement@test.com",
      password: "123456",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Testing deposit",
    });

    expect(deposit).toHaveProperty("id");
  });

  it("should be abe to do a withdraw on an user account", async () => {
    const {
      user: { id },
    } = await authenticateUserUseCase.execute({
      email: "statement@test.com",
      password: "123456",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: id!,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: "Testing withdraw",
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("should be able to get all user statements using user id", async () => {
    const {
      user: { id },
    } = await authenticateUserUseCase.execute({
      email: "statement@test.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({ user_id: id! });

    expect(balance.statement.length).toBeGreaterThan(0);
  });

  it("should be able to get a user statement by id", async () => {
    const {
      user: { id: user_id },
    } = await authenticateUserUseCase.execute({
      email: "statement@test.com",
      password: "123456",
    });

    const { id: statement_id } = await createStatementUseCase.execute({
      user_id: user_id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Testing deposit",
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user_id!,
      statement_id: statement_id!,
    });

    expect(operation.id).toBe(statement_id);
  });
});
