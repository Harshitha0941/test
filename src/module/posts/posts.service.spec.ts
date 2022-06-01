/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { HttpException} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { PostsDto } from "./dto/posts.dto";
import { PostsService } from "./posts.service";
import { UserService } from "../user/user.service";
import { request } from "express";
import { Repository } from 'typeorm';
import { Posts } from "../../entitty/post.entity";
import { User } from './../../entitty/user.entity';


const posts = [{
    id: 1,
    title: "google",
    description: "good",
    user:1,
    is_featured: "true",
    created_date:"09/06/2022",
    updated_date :"03/09/2022"
  }]
const ofImportDto = plainToInstance( PostsDto, posts)
 
describe('PostService', () => {
    let postsService : PostsService; 
    let  userService;
    let usersRepo: Repository<User>
    let postsRepo : Repository<Posts>
    beforeEach(async () => {

   
        let module: TestingModule = await Test.createTestingModule({
            providers: [ PostsService, 
                { 
                provide:postsRepo,
                useFactory: () => ({
                    save:jest.fn(),
                    find:jest.fn(),
                    findOne:jest.fn(),
                    delete:jest.fn(),
                    update:jest.fn(),
                    
                })

            },
            userService, {
                provide:usersRepo,
                useFactory: () => ({
                    findOne:jest.fn()
                })
            },
            {
                provide: JwtService,
                useFactory: () => {
                    sign: jest.fn()
                }

            }
        ]
        }).compile();

        postsService = module.get<PostsService>(PostsService);
        userService = module.get<UserService>(UserService);
    })
    it("should be defined", ()=> {
        expect(postsService).toBeDefined()
    })

    //addPost
    describe("When addPost", () => {
        describe('AND Success', () => {
            it('should return response', async () => {
                const user = {
                        id: 1,
                        name: "kjh",
                        password: "",
                        display_name: "pro"
                      }
                let userSpy = jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
                console.log("From test",userSpy)
                const message = 'Posted data successfully'
                let findOneSpy = jest.spyOn(postsService, 'addPosts').mockResolvedValue(message);
                let response = await  postsService.addPosts(ofImportDto[0],request);
                expect(response).toEqual( `Post added successfully by this`);
                expect(findOneSpy).toHaveBeenCalledTimes(1)
                expect(userSpy).toHaveBeenCalledTimes(1)
              
            })
        })

       
        describe('AND failed', () => {
            it('should return error', async () => {
                let findOneSpy = jest.spyOn(userService, 'getUserById').mockRejectedValue(new Error('Post not added'));  
                await expect(postsService.addPosts(ofImportDto[0],request)).rejects.toThrow(HttpException);
                expect(findOneSpy).toHaveBeenCalledTimes(1)

            })

        })
    })

     // List all posts
    describe("When listPosts()", () => {
        describe('AND Success', () => {
            it('should return response', async () => {
             
                let findOneSpy = jest.spyOn(postsRepo, 'find').mockResolvedValue(ofImportDto);
                let response = await  postsService.getAllPosts(request);
                expect(response).toEqual(ofImportDto);
                expect(findOneSpy).toHaveBeenCalled()
              
            })

        })

        describe('AND failed', () => {
            it('should return error', async () => {
                let findOneSpy = jest.spyOn(postsRepo, 'find').mockRejectedValue(new Error('Hotel not found'));  
                await expect(postsService.getAllPosts(request)).rejects.toThrow(HttpException);
                expect(findOneSpy).toHaveBeenCalled()

            })

        })
    })

    // //Delete post
    describe("When deletePost", () => {
        describe('AND Success', () => {
            it('should return response', async () => {
                const message = `Deleted successfully `;

                const delpost = { generatedMaps: [], raw: [], affected: 1 };

                const findOneSpy = jest.spyOn(postsRepo, 'delete').mockResolvedValue(delpost);
                let response = await  postsService.deletePostsById(1,request);
                expect(response).toEqual(message);
                expect(findOneSpy).toHaveBeenCalled()
            })
        })

        describe('AND failed', () => {
            it('should return error', async () => {
                const findOneSpy = jest.spyOn(postsRepo, 'delete').mockRejectedValue( Error('Not deleted'));  

                await expect(postsService.deletePostsById(1,request)).rejects.toThrow(HttpException);
                expect(findOneSpy).toHaveBeenCalled()
                expect(findOneSpy).toHaveBeenCalledTimes(1)
            })
        })
    })

     //getPostBy id
    describe("When getPostByid", () => {
        describe('AND Success', () => {
            it('should return response', async () => {
                const findOneSpy = jest.spyOn(postsRepo, 'findOne').mockResolvedValue(ofImportDto[0]);
                let response = await  postsService.getPostsById(1,request);

                expect(response).toEqual(ofImportDto[0]);
                expect(findOneSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('AND failed', () => {
            it('should return error', async () => {
                const findOneSpy = jest.spyOn(postsRepo, 'findOne').mockRejectedValue(new Error('Hotel not found'));  

                await expect(postsService.getPostsById(1,request)).rejects.toThrow(HttpException);
                expect(findOneSpy).toHaveBeenCalled()
                 
            })
        })
    })

    // //update post
    describe("When updatePost", () => {
        describe('AND Success', () => {
            it('should call updateNote method with expected params', async () => {
                const updatepost = { generatedMaps: [], raw: [], affected: 1 };
                const findOneSpy = jest.spyOn(postsRepo, 'update').mockResolvedValue(updatepost);
                const noteId = 1;
                const dto = new PostsDto();
                await postsService.updatePosts(noteId, dto,request);
                expect(findOneSpy).toHaveBeenCalledTimes(1);
        });
            
        })

        describe('AND failed', () => {
            it('should return error', async () => {
                const noteId = 1;
                const dto = new PostsDto();
                const findOneSpy = jest.spyOn(postsRepo, 'update').mockRejectedValue(new Error('Not updated'));  
                await expect(postsService.updatePosts(noteId, dto,request)).rejects.toThrow(HttpException);
                expect(findOneSpy).toHaveBeenCalled()
                 
            })
        })
    })
})

 
