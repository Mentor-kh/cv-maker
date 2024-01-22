import { UserProfile } from "src/app/swagger-api";

export const mockProfile: UserProfile = {
    entityId: 'mock',
    firstName: 'First',
    lastName: 'Last',
    phone: '1234567890',
    password: '123',
    image: '',
    email: 'example@gmail.com',
    address: 'Mock address',
    site: 'http://example.com',
    additionals: [{
        title: 'add title',
        info: 'add info',
    }],
  }