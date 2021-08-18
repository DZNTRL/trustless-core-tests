import { expect } from "chai"
import ProWebModels from "pro-web-models"
import sinon from "sinon"
import mysql from "mysql2"
import { testData } from "./test-data"

describe("User Repo Tests", function() {
    const db = {
        "host": "localhost",
        "user": "pro-web-user",
        "password": "DBcpIZWXXF",
        "database": "proweb",
        "socketPath": "/var/run/mysqld/mysqld.sock"
        }
    const stub = sinon.stub()
    const fake = () => {
        console.log("called")
    }
    const _testData = testData("test");
    // stub(mysql, "createPool", fake)
    it("User class should exist on import", () => {
        expect(ProWebModels.User).to.be.an("function")
    })
    it("User class should instantiate with db connection info", async () => {
        const pool = await mysql.createPool(db)
        //@ts-ignore
        expect(new ProWebModels.User(pool)).to.be.an("object")  
    })
    xit("User instance should return id > 0 when creating account", async () => {
        const pool = await mysql.createPool(db)
        //@ts-ignore
        const instance = new ProWebModels.User(pool)
        //@ts-ignore
        const result = await instance.createUser(_testData.user[0].username, _testData.user[0].publicKey)
        expect(result).to.be.greaterThan(0)
    })
    it("User instance should return false when username is unique", async () => {
        const pool = await mysql.createPool(db)
        //@ts-ignore
        const instance = new ProWebModels.User(pool)
        const result = await instance.checkUsernameUnique("TEST")
        console.log(result)
    })
})