import {describe, it, expect} from '@jest/globals';
import { SignalingType, SignalingCollection, SignalingModel } from "protolib/bundles/signalings"

describe("Test SignalingModel", () => {
    describe("Test SignalingModel entity creation", () => {
        const baseData = {
            clientId: "myMqttClient",
            status: "online",
            ts: Date.now()
        }
        it("shoud be able to create SignalingModel given all params", () => {
            const signalingModel = SignalingModel.load(baseData) as SignalingModel
            expect(signalingModel.getClientId()).toBe("myMqttClient")
            expect(signalingModel.getStatus()).toBe("online")
        })
        it("should be able to create SignalingModel missing timetamp field 'ts'", () => {
            const { ts, ...rest } = baseData
            const signalingModel = SignalingModel.load(rest) as SignalingModel
            expect(signalingModel.getData()).toHaveProperty("ts")
            expect(signalingModel.getTimestamp()).toBeTruthy()
        })
    })

    describe("Test SignalingCollection entity creation", () => {
        const signalings: SignalingType[] = [
            {
                id: '1',
                status: "online",
                clientId: "client1",
                ts: 1
            },
            {
                id: '2',
                status: "offline",
                clientId: "client1",
                ts: 2
            },
            {
                id: '3',
                status: "online",
                clientId: "client2",
                ts: 3
            },
            {
                id: '4',
                status: "offline",
                clientId: "client2",
                ts: 4
            },
            {
                id: '5',
                status: "online",
                clientId: "client2",
                ts: 5
            },
            {
                id: '6',
                status: "offline",
                clientId: "client2",
                ts: 6
            },
            {
                id: '7',
                status: "online",
                clientId: "client1",
                ts: 7
            },
            {
                id: '8',
                status: "offline",
                clientId: "client1",
                ts: 8
            },
            {
                id: '9',
                status: "online",
                clientId: "client2",
                ts: 9
            }
        ]
        const signalingCollection = SignalingCollection.load(signalings)
        it("shoud be able to create SignalingCollection given all params", () => {
            expect(signalingCollection.constructor.name).toBe("SignalingCollection")
        })
        it("should be able to create SignalingCollection with empty items", () => {
            const emptySignalingCollection = SignalingCollection.load([])
            expect(emptySignalingCollection.constructor.name).toBe("SignalingCollection")
            expect(emptySignalingCollection.getItems()).toEqual([]);
            expect(emptySignalingCollection.getLength()).toBe(0);
        })
        it("should be able to retrieve SignalingCollection items", () => {
            expect(signalingCollection.getItems()).toEqual(signalings)
        })
        it("should be able to retrieve SignalingCollection length", () => {
            expect(signalingCollection.getLength()).toBe(signalings.length)
        })
        describe("Test method to retrieve last status given array of clients", () => {
            it("should be able to retrieve last status for one client", () => {
                const clientIds = ["client1"]
                expect(signalingCollection.getLastStatus(clientIds)).toEqual({ client1: "offline" })
            })
            it("should be able to retrieve last status for one client", () => {
                const clientIds = ["client1", "client2"]
                expect(signalingCollection.getLastStatus(clientIds)).toEqual({ client1: "offline", client2: "online" })
            })
            it("should be able to retrieve last status even for a client that doesn't exist", () => {
                const noExistClientId = "patata";
                const clientIds = [ "client2", noExistClientId]
                expect(signalingCollection.getLastStatus(clientIds)).toEqual({ [noExistClientId]: "offline", client2: "online" })
            })
            it("should be able to retrieve last status empty when no clients specified", () => {
                expect(signalingCollection.getLastStatus([])).toEqual({})
            })
            it("should be able to retrieve last status empty when have no signals and specify clientIds", () => {
                expect(SignalingCollection.load([]).getLastStatus(["client1", "client2"])).toEqual({ client1: "offline", client2: "offline"})
            })
            it("should be able to retrieve last status empty when have no signals and no clientIds", () => {
                expect(SignalingCollection.load([]).getLastStatus([])).toEqual({})
            })
        })
    })
})