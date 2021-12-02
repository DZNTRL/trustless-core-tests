import Core from "pro-web-core"
import { expect } from "chai"
import { encryptChallenge } from "pro-web-core/dist/js/utils/encryptChallenge"
import { testData } from "../repo/test-data"
import { baseUser } from "../testuser"
const _testData = testData("test");
const publicKey = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
1tvJTCNO
=wXh8
-----END PGP PUBLIC KEY BLOCK-----
`
describe("ProWebCore Utils Test Suite", function(){
    describe("createChallenge tests", function() {
        const createChallenge = Core.Utils.createChallenge
        it("should create a challenge with 12 'words'", async () => {
            const challenge = createChallenge()
            expect(challenge).to.be.a("string")
        })
    })
    describe("encryptChallenge tests", function() {
        const createChallenge = Core.Utils.createChallenge
        it("should encrypt a challenge with 12 'words'", async () => {
            const challenge = createChallenge()
            const publicKeya = _testData.user[0].publicKey
            const result = await encryptChallenge(challenge, `${baseUser.publicKey}`)
        })
    })

})
