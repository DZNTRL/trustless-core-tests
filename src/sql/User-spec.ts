import { expect } from "chai"
import ProWebCore from "pro-web-core"
import { IUser } from "pro-web-core/dist/js/interfaces/repo/IUser"
import mysql from "mysql2/promise"
import { testData } from "./test-data"
import config from "config"
import { ResponseMessages } from "pro-web-core/dist/js/enums/ResponseMessages"

describe("User Repo Tests", function() {
    const db = config.get("db")
    const _testData = testData("test");
    var pool: mysql.Pool;
    var instance: IUser;
    this.beforeAll(async() => {
        pool = await mysql.createPool(db)
        instance = new ProWebCore.Repo.User(pool)
    })
    this.afterAll(async () => {
        console.log("after all")
        pool.query("DELETE FROM Accounts WHERE username LIKE '[TEST]%'")
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
            const result = await instance.checkUsernameUnique("ABCDEFGHIJKLACD")
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ProWebCore.Enums.ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
    })
    describe("User getPublicKey tests", function() {
        it("User instance should get publicKey for existing user", async() => {
            const result = await instance.getPublicKey(_testData.user[0].username)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ProWebCore.Enums.ResponseMessages.OK.toString())
            console.log(result.Data)
        })
        it("User instance should NOT get publicKey for non-existing user", async() => {
            const result = await instance.getPublicKey("ABCEEFDASFJ43")
            expect(result.IsError).to.equal(true)
            expect(result.Message).to.equal(ProWebCore.Enums.ResponseMessages.NotFound.toString())
        })
    })
    describe("User.createChallenge tests", function() {
        const challenge = "stone north year bright hip bacon flush tribe stairs idle submit merry"
        it("createChallenge() should return true when successfully saved", async() => {
            const result = await instance.createChallenge(_testData.user[0].username, challenge)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
        it("createChallenge() should return false when user not found", async() => {
            const result = await instance.createChallenge("BADFDF", challenge)
            expect(result.IsError).to.equal(true)
            expect(result.Message).to.equal(ResponseMessages.NoRecordsUpdated.toString())
            expect(result.Data).to.equal(false)
        })
    })
})