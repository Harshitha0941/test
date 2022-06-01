/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { request } from "express";
import { PostsDto } from "./dto/posts.dto";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
 

 
const posts  = [{
    title: "google",
    description: "good",
    user:1,
    is_featured: "true"
  }]
const ofImportDto = plainToInstance(PostsDto, posts)
// const errors = await validate(ofImportDto, { skipMissingProperties: true })
describe('Given posts', () => {
  let postsController: PostsController;
  let postsService: PostsService;
    
    beforeEach(async () =>{
         let module = await Test.createTestingModule({
             controllers :[PostsController],
             providers:[ PostsService, {
                 provide: PostsService,
                 useFactory: () =>({
                    addPosts: jest.fn(),
                    getAllPosts: jest.fn(),
                    getPostsById:jest.fn(),
                    deletePostsById: jest.fn(),
                    updatePosts:jest.fn()
                 })
             }]
         }).compile()

         postsController = module.get<PostsController>(PostsController)
         postsService = module.get<PostsService>(PostsService)
     })   
     it('should be defined', () => {
         expect(postsController).toBeDefined();
     }) 
    
    //addPost
    describe('When add Post', ()=> {
        it('should return response', async ()=>{
            const message = 'Success';
            let addPostsSpy = jest.spyOn(postsService, 'addPosts').mockResolvedValue(message)
            let response = await postsController.addPosts(ofImportDto[1],request);
            expect(response).toEqual(message)
            expect(addPostsSpy).toHaveBeenCalled();
            expect(addPostsSpy).toHaveBeenCalledTimes(1)
        } )
    })

    //listOfPosts
    describe('When getAll Post', ()=> {
        it('should return response', async ()=>{

            let getAllPostsSpy = jest.spyOn(postsService, 'getAllPosts').mockResolvedValue(ofImportDto)
            let response = await postsController.getAllPosts(request);
            expect(response).toEqual(ofImportDto)
            expect(getAllPostsSpy).toHaveBeenCalled();
            expect(getAllPostsSpy).toHaveBeenCalledTimes(1)
        } )
     })

    //deletePost
    describe('When DeletePost()', ()=> {
        it('should return response', async ()=>{
            let postDetails = 'success';
            let getOnepostSpy = jest.spyOn(postsService, 'deletePostsById').mockResolvedValue(postDetails)
            let response = await postsController.deletePostsById(1,request);
            expect(response).toEqual(postDetails);
            expect(getOnepostSpy).toHaveBeenCalled()
            expect(getOnepostSpy).toHaveBeenCalledTimes(1)
        } )
    })



    //getPostById
    describe('When Get Post By Id()', ()=> {
        it('should return response', async ()=>{   
          
            let getPostByIdSpy = jest.spyOn(postsService, 'getPostsById').mockResolvedValue(ofImportDto[0])
            let response = await postsController.getPostsById(1,request);
            expect(response).toEqual(ofImportDto[0])
            expect(getPostByIdSpy).toHaveBeenCalled()
            expect(getPostByIdSpy).toHaveBeenCalledTimes(1)
        } )
    })

    describe('When updateePost()', ()=> {
        it('should return response', async ()=>{
            const message = 'Success';
            let getOnepostSpy = jest.spyOn(postsService, 'updatePosts').mockResolvedValue(message)
            let response = await postsController.updatePosts(ofImportDto[0],request,1);
            expect(response).toEqual(message);
            expect(getOnepostSpy).toHaveBeenCalled()
            expect(getOnepostSpy).toHaveBeenCalledTimes(1)
        } )
    })
})

