import { expect } from "chai"
import ProWebModels from "pro-web-core"
import mysql from "mysql2/promise"
import { testData } from "./test-data"
import config from "config"

describe("User Repo Tests", function() {
    const db = config.get("db")
    const _testData = testData("test");
    this.afterAll(async () => {
        const pool = await mysql.createPool(db)
        pool.query("DELETE FROM Accounts")
    })
    it("User class should exist on import", () => {
        expect(ProWebModels.User).to.be.an("function")
    })
    it("User class should instantiate with db connection info", async () => {
        const pool = await mysql.createPool(db)
        //@ts-ignore
        expect(new ProWebModels.User(pool)).to.be.instanceOf(ProWebModels.User)
    })
    describe("User createUser tests", function() {
        it("User instance should return id > 0 when creating account", async () => {
            const pool = await mysql.createPool(db)
            const instance = new ProWebModels.User(pool)
            const result = await instance.createUser(_testData.user[0].username, _testData.user[0].publicKey)
            expect(result.Data).to.be.greaterThan(0)
        })    
    })
    describe("User checkUsernameUnique tests", function() {
        it("User instance should return false when username is not unique", async () => {
            const pool = await mysql.createPool(db)
            const instance = new ProWebModels.User(pool)
            const result = await instance.checkUsernameUnique(_testData.user[0].username)
            expect(result.Data).to.equal(false)
        })
        it("User instance should return true when username is unique", async() => {
            const pool = await mysql.createPool(db)
            const instance = new ProWebModels.User(pool)
            const result = await instance.checkUsernameUnique("ABCDEFGHIJKLACD")
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ProWebModels.ResponseMessages.OK.toString())
            expect(result.Data).to.equal(true)
        })
    })
    describe("User getPublicKey tests", function() {
        it("User instance should get publicKey for existing user", async() => {
            const pool = await mysql.createPool(db)
            const instance = new ProWebModels.User(pool)
            const result = await instance.getPublicKey(_testData.user[0].username)
            expect(result.IsError).to.equal(false)
            expect(result.Message).to.equal(ProWebModels.ResponseMessages.OK.toString())
            console.log(result.Data)
        })
        it("User instance should NOT get publicKey for non-existing user", async() => {
            const pool = await mysql.createPool(db)
            const instance = new ProWebModels.User(pool)
            const result = await instance.getPublicKey("ABCEEFDASFJ43")
            expect(result.IsError).to.equal(true)
            expect(result.Message).to.equal(ProWebModels.ResponseMessages.NotFound.toString())
        })
    })
})