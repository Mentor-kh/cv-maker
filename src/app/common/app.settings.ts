import { environment } from 'src/environments/environment';

export default class AppSettings {
  public static BASE_URL: string = environment.apiUrl;
}