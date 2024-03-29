/**
 * DeArchNet rest API
 * Specification of REST API for DeArchNet Project
 *
 * OpenAPI spec version: 0.1.2
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { UserBasic } from './userBasic';
import { UserProfileAdditionals } from './userProfileAdditionals';

export interface UserProfile extends UserBasic { 
    image?: string;
    email?: string;
    address?: string;
    site?: string;
    additionals?: Array<UserProfileAdditionals>;
}