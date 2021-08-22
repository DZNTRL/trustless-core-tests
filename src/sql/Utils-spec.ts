import { expect } from "chai"
import sinon from "sinon"
import mysql from "mysql2"
import config from "config"
import ProWebModels from "pro-web-models"
import { IResponse } from "pro-web-models"
const { Response, Utils, ResponseMessages } = ProWebModels

describe("SQLUtil Tests", function() {
    const db = config.get("db")
    const stub = sinon.stub()
    const fake = () => {
        return new Promise((res, rej) => {
            res({query: (sql, params, res, rej, {}, outData) => {
                if(outData.IsError) {
                    return rej(outData)
                }
                res(outData)
            }})
        })
    }
    stub(mysql, "createPool", fake)
    const pool = mysql.createPool(db)
    const sql = `SELECT 0 as output`
    it("query() should have proper Message, IsError values AND call provided onResolve() when successful", async () => {
        const outResp = new Response({output: 0});
        const onResolve = (resp: IResponse<{output: number}>) => {
            return new Response({output: resp.Data.output, a: 1})
        }
        const onReject = (resp: IResponse<{output: number}>) => resp
        //@ts-ignore
        const resp = await Utils.query(pool, sql, [], onResolve, onReject, outResp)
        expect(resp).to.be.an.instanceof(Response)
        expect(resp.Data).to.have.property("output")
        expect(resp.Data).to.have.property("a" )
        expect(resp.Message).to.equal(ResponseMessages.OK.toString())
        expect(resp.IsError).to.equal(false)
    })
    it("query() should have proper Message, IsError value when onReject() is callded", async() => {
        const outputResp = new Response(null, ResponseMessages.NotFound.toString(), true)
    })
})