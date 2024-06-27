import mongoose from "mongoose";
import { expect } from "chai";
import { userService } from "../../../src/repository/index.js";

describe('Testing User Dao', ()=>{
    before(async function () {
        this.timeout(5000);
        this.userService = userService;
        await mongoose.connect('mongodb+srv://moisesagauna:abc123456@cluster1.mr0efqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1');
    })

    beforeEach(async function (){
        this.timeout(5000);
        await mongoose.connection.collections.user.deleteMany();
    });

    it('El dao debe agregar un usuario a la DB correctamente', async function(){
        //Given
        const user = {
            username: "pruebaTest1@gmail.com",
            name: "prueba1",
            lastname: "test1",
            tel: "12545632",
            password: "123qwe",
        }

        //Then
        const result = await this.userService.regUser(user.username, user.name, user.lastname, user.tel, user.password);

        //Assert That
        expect(result).to.be.ok.and.have.deep.property("_id")
        expect(result._id).to.be.ok
    })

    it('El dao debe devolver los usuarios en forma de arreglo', async function () {   
        //Given
        const isArray = []  ;
        
        //Then
        const result = await this.userService.getAllUsers()

        //Assert that
        expect(result).to.be.deep.equal(isArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.eql(true);
        expect(result.length).to.be.deep.equal(isArray.length);
    })

    it('El dao debe devolver un usuario por su username', async function(){
        //Given
        const user = {
            username: "pruebaTest1@gmail.com",
            name: "prueba1",
            lastname: "test1",
            tel: "12545632",
            password: "123qwe",
        }
    
        // Create the user before trying to retrieve it
        await this.userService.regUser(user.username, user.name, user.lastname, user.tel, user.password);
    
        //Then
        const result = await this.userService.getUsers(user.username)
    
        //Assert That
        expect(result).to.be.ok.and.have.deep.property("_id")
        expect(result._id).to.be.ok
    })

    it('El dao debe loggear un usuario registrado', async function(){
        //Given
        const user = {
            username: "pruebaTest1@gmail.com",
            name: "prueba1",
            lastname: "test1",
            tel: "12545632",
            password: "123qwe"
        }

        // Create the user before trying to log in
        await this.userService.regUser(user.username, user.name, user.lastname, user.tel, user.password);

        //Then

        const result = await this.userService.logInUser(user.username, user.password);

        //Assert That
        expect(result).to.be.ok.and.have.deep.property("_id")
        expect(result._id).to.be.ok
    })

    afterEach(async function () {
        await mongoose.connection.collections.user.deleteMany();
    })

    after(async function() {
        await mongoose.disconnect();
    });


})