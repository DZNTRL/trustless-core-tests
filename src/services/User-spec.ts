import { expect } from "chai"
import sinon from "sinon"
import { testData } from "../sql/test-data"
import { injections } from "pro-web-core"
import { IUser } from "pro-web-core/dist/js/interfaces/repo/IUser"
import mysql from "mysql2/promise"
import config from "config"
import { ResponseMessages } from "pro-web-core/dist/js/enums/ResponseMessages"
import ProWebCore from "pro-web-core"

describe("User Service Tests", function() {
    const db = config.get("db")
    const _testData = testData("test");
    var pool: mysql.Pool;
    var instance: IUser;
    const challenge = "stone north year bright hip bacon flush tribe stairs idle submit merry"
    const challengeB = "rock north year bright hip bacon flush tribe stairs idle submit merry"
    const invalidUser = "ZZZZZZZZZZZZZZZDDDDDDDDDHHHH###"
    const invalidChallenge = "bla"
    const Response = ProWebCore.Response
    console.log(_testData.user)
    describe("User.requestLogin() tests", function() {
        const userRepo = injections().UserRepo(pool)
        const stub = sinon.stub(userRepo, "getChallenge") 
        stub
            .withArgs(_testData.user[0].username)
            .returns(new Response(challenge))
            .withArgs(_testData.user[1].username)
            .returns(new Response(challengeB))
            .withArgs(invalidUser)
            .returns(new Response(null, ResponseMessages.NotFound.toString()))
        const stubUniq = sinon.stub(userRepo, "checkUsernameUnique")
        stubUniq
            .withArgs(_testData.user[0].username)
            .returns(false)
            .withArgs(invalidUser)
            .returns(true)
        const stubCreateChallenge = sinon.stub(userRepo, "createChallenge")
        stubCreateChallenge
            .withArgs(_testData.user[0].username)
            .returns(new Response(challenge))
            .withArgs(_testData.user[1].username)
            .returns(new Response(challengeB))
            .withArgs(invalidUser)
            .returns(new Response(null, ResponseMessages.NotFound.toString()))
        it("should return challenge with valid username", async() => {
            const resp = await userRepo.getChallenge(_testData.user[0].username)
            expect(resp.IsError).to.equal(false)
            expect(resp.Message).to.equal(ResponseMessages.OK.toString())
            expect(resp.Data).to.equal(challenge)
        })
        it("should not return challenge with invalid username", async() => {
            const resp = await userRepo.getChallenge(invalidUser)
            expect(resp.IsError).to.equal(false)
            expect(resp.Message).to.equal(ResponseMessages.NotFound.toString())
            expect(resp.Data).to.equal(null)
        })
        it("should create & return challenge with valid username but without existing challenge", async() => {
            const resp = await userRepo.getChallenge(_testData.user[1].username)
            expect(resp.IsError).to.equal(false)
            expect(resp.Message).to.equal(ResponseMessages.OK.toString())
            expect(resp.Data).to.equal(challengeB)
        })
    })
})