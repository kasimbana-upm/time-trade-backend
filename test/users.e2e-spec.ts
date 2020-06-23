import { UsersModule } from "../src/users/users.module";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from 'supertest';
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule } from "@nestjs/mongoose";
import * as Faker from "faker";
import { UsersService } from "../src/users/users.service";

describe('UsersController (e2e)', () => {
    let moduleFixture: TestingModule;
    let mongod: MongoMemoryServer;
    let app: INestApplication;
    let service: UsersService;

    const endpoint = "/users";

    beforeEach(async () => {
        mongod = new MongoMemoryServer();

        moduleFixture = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongod.getUri(),
                        useCreateIndex: true
                    })
                }),
                UsersModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        service = moduleFixture.get<UsersService>(UsersService);
        await app.init();

        await seedDatabase();
    });

    afterEach(async () => {
        await moduleFixture.close();
        await mongod.stop();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get(endpoint)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            });
    });

    it("/users (POST)", async () => {
        const newUser = {
            email: Faker.internet.email(),
            name: Faker.name.firstName(),
            surname: Faker.name.lastName(),
            password: Faker.internet.password()
        };
        
        const res = await request(app.getHttpServer())
            .post(endpoint)
            .send(newUser)
            .expect(201);
        expect(res.body).toMatchObject(newUser);
    });

    it("/users (POST) should return 409 user already exists", () => {
        const repeatedUser = {
            email: "repeated@gmail.com",
            name: Faker.name.firstName(),
            surname: Faker.name.lastName(),
            password: Faker.internet.password()
        };

        const errorResponse = {
            statusCode: 409,
            message: "Ya existe un usuario con este email",
            error: "Conflict"
        }

        return request(app.getHttpServer())
            .post(endpoint)
            .send(repeatedUser)
            .expect(409, errorResponse);
    });

    async function seedDatabase() {
        const defaultaData = [
            {
                email: Faker.internet.email(),
                name: Faker.name.firstName(),
                surname: Faker.name.lastName(),
                password: Faker.internet.password()
            },
            {
                email: "repeated@gmail.com",
                name: Faker.name.firstName(),
                surname: Faker.name.lastName(),
                password: Faker.internet.password()
            }
        ];

        defaultaData.forEach(async user => {
            await service.create(user);
        });
    }
});
