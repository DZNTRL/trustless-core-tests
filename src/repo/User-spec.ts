import { expect } from "chai"
import ProWebCore from "pro-web-core"
import { IUser } from "pro-web-common/dist/js/interfaces/repo/IUser"
import mysql from "mysql2/promise"
import { testData } from "./test-data"
import config from "config"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"

describe("User Repo Tests", function() {
    const db = config.get("db")
    const _testData = testData("test");
    var pool: mysql.Pool;
    var instance: IUser;
    const challenge = "stone north year bright hip bacon flush tribe stairs idle submit merry"
    const invalidUser = "ZZZZZZZZZZZZZZZDDDDDDDDDHHHH###"
    const invalidChallenge = "bla"
    this.beforeAll(async() => {
        pool = await mysql.createPool(db)
        instance = new ProWebCore.Repo.User({pool})
    })
    this.afterAll( (done) => {
        pool.query("DELETE FROM Accounts WHERE username LIKE '[TEST]%'")
            .then(res => done())
            .catch(e => done(e))
    })
    it("User class should exist on import", () => {
        expect(ProWebCore.Repo.User).to.be.an("function")
    })
    it("User class should instantiate with db connection info", async () => {
        //@ts-ignore
        expect(new ProWebCore.Repo.User(pool)).to.be.instanceOf(ProWebCore.Repo.User)
    })
    describe("User createUser tests", function() {
        it("User instance should return id > 0 when creating account", async () => {
            const result = await instance.createUser(_testData.user[0].username, _testData.user[0].publicKey)
            expect(result.Data).to.be.greaterThan(0)
        })    
    })
    describe("User checkUsernameUnique tests", function() {
        it("User instance should return false when username is not unique", async () => {
            const result = await instance.checkUsernameUnique(_testData.user[0].username)
            expect(result.Data).to.equal(false)
        })
        it("User instance should return true when username is unique", async() => {
            const result = await instance.checkUsernameUnique(invalidUser)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
    })
    describe("User getPublicKey tests", function() {
        it("User instance should get publicKey for existing user", async() => {
            const result = await instance.getPublicKey(_testData.user[0].username)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
        })
        it("User instance should NOT get publicKey for non-existing user", async() => {
            const result = await instance.getPublicKey("ABCEEFDASFJ43")
            expect(result.IsError).to.equal(true)
            expect(result.Message).to.equal(ResponseMessages.NotFound.toString())
        })
    })
    describe("User.createChallenge tests", function() {
        it("createChallenge() should return true when successfully saved", async() => {
            const result = await instance.createChallenge(_testData.user[0].username, challenge)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
        it("createChallenge() should return false when user not found", async() => {
            const result = await instance.createChallenge(invalidUser, challenge)
            expect(result.IsError).to.equal(true)
            expect(result.Message).to.equal(ResponseMessages.NoRecordsUpdated.toString())
            expect(result.Data).to.equal(false)
        })
    })
    describe("User.getChallenge() tests", function() {
        it("getChallenge() should return the challenge when a valid username is passed and the user has a challenge", async() => {
            const result = await instance.getChallenge(_testData.user[0].username)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(challenge)
        })
        it("getChallenge() should not return a challenge when an invalid username is passed", async() => {
            const result = await instance.getChallenge(invalidUser)
            expect(result.IsError).to.equal(true)
            expect(result.Data).to.equal(null)
        })
    })
    describe("User.verifyChallenge()", function() {
        it("verifyChallenge() should return true if the username is valid and the challenge argument matches whats saved in the db", async() => {
            const result = await instance.verifyChallenge(_testData.user[0].username, challenge)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
        it("verifyChallenge() should return false with valid username but non-matching challenge", async() => {
            const result = await instance.verifyChallenge(_testData.user[0].username, invalidChallenge)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(false)
  
        })
        it("verifyChallenge() should return false if the username is invalid", async() => {
            const result = await instance.verifyChallenge(invalidUser, challenge)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(false)
        })
    })
    describe("User.get()", function() {
        it("should get user with valid username", async() => {
            const _user = _testData.user[0]
            const result = await instance.get(_user.username)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data.username).to.equal(_user.username)
            expect(result.Data.id).to.be.greaterThan(0)
            expect(result.Data.publicKey).to.equal(_user.publicKey)
        })
        it("should return message not found with invalid username", async() => {
            const result = await instance.get("poo")
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.NotFound.toString())
            expect(result.Data).to.equal(null)
        })
    })
})