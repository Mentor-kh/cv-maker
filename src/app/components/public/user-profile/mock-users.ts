import { UserBasic } from "src/app/swagger-api";

export const mockUserBasic: UserBasic = {
    entityId: "qwerty",
    firstName: "firstName",
    lastName: "lastName",
    phone: "1234567890",
    // todo: remove password from model
    password: "qwerty",
}