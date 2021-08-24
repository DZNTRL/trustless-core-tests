import { expect } from "chai"
import sinon from "sinon"
import mysql from "mysql2/promise"
import config from "config"
import ProWebModels from "pro-web-core"
import { IResponse } from "pro-web-core"
const { Response, Utils, ResponseMessages } = ProWebModels

xdescribe("SQLUtil Tests", async function() {
    const db = config.get("db")
    // const fake = (db, cb) => {
    //     console.log("cb", cb)  
    //     cb({query: (sql, params, res, rej) => {
    //         const resp = new Response({output: 0})
    //         res(resp)
    //     }})
    // }   
    // const stub = sinon.stub(mysql, "createPool").callsFake(fake)
    // const createPool = () => new Promise((res, rej) => {
    //     const p = mysql.createPool(db)
        
    // })
    var pool: mysql.Pool | null;
    try {
        pool = await mysql.createPool(db)
    } catch(e) {
        throw new Error(e)
    }
    const sql = `SELECT 0 as output`
    xit("query() should have proper Message, IsError value when onReject() is called", async() => {
        // const outResp = new Response(null, ResponseMessages.NotFound.toString(), true)
        // const onResolve = (resp: IResponse<null>) => resp
        // const onReject = (resp: IResponse<any>) => {
        //     console.log("resp", resp)
        //     if(resp.Data[0].output === 0) {
        //         resp.Data = null
        //         resp.IsError = true    
        //     }
        //     return resp
        // }
        //@ts-ignore
        var resp: IResponse<any>
        try {
            resp = await Utils.query(pool, "select * from x", [])
        } catch (e) {
            resp = e
        }
        expect(resp).to.be.an.instanceof(Response)
        expect(resp.IsError).to.equal(true)
        expect(resp.Data).to.be.a('null')
    })
    xit("query() should have proper Message, IsError values AND call provided onResolve() when successful", async () => {
        //@ts-ignore
        const resp = await Utils.query<{output: number}>(pool, "SELECT 1 as output", [])

        expect(resp).to.be.an.instanceof(Response)
        expect(resp.Data).to.have.property("output")
        expect(resp.Data.output).to.equal(1)
        expect(resp.Message).to.equal(ResponseMessages.OK.toString())
        expect(resp.IsError).to.equal(false)
    })
})