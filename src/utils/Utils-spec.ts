import Core from "pro-web-core"
import { expect } from "chai"

describe("ProWebCore Utils Test Suite", function(){
    describe("createChallenge tests", function() {
        const createChallenge = Core.Utils.createChallenge
        it("should create a challenge with 12 'words'", async () => {
            const challenge = createChallenge()
            console.log("challenge=", challenge)
            expect(challenge).to.be.a("string")
        })
    })
})
