import BN from "bn.js";
import { Cell, beginCell, Address } from "ton";
import { beginMessage } from "./helpers";

export function data(params: {
    totalSupply: BN;
    adminAddress: Address;
    content: Cell;
    jettonWalletCode: Cell;
}): Cell {
    return beginCell()
        .storeCoins(params.totalSupply)
        .storeAddress(params.adminAddress)
        .storeRef(params.content)
        .storeRef(params.jettonWalletCode)
        .endCell();
}

export function mint(params: { toAddress: Address; gasAmount: BN, jettonAmount: BN; fromAddress?: Address; responseAddress?: Address; forwardTonAmount?: BN; }): Cell {
    return beginMessage({ op: new BN(21) })
        .storeAddress(params.toAddress)
        .storeCoins(params.gasAmount)
        .storeRef(beginCell()
            .storeUint(0x178d4519, 32)
            .storeUint(0, 64)
            .storeCoins(params.jettonAmount)
            .storeAddress(params.fromAddress || null)
            .storeAddress(params.responseAddress || null)
            .storeCoins(params.forwardTonAmount || new BN(0))
            .endCell())
        .endCell();
}

export function burnNotification(params: { jettonAmount: BN; fromAddress: Address; responseAddress?: Address }): Cell {
    return beginMessage({ op: new BN(0x7bdd97de) })
        .storeCoins(params.jettonAmount)
        .storeAddress(params.fromAddress)
        .storeAddress(params.responseAddress || null)
        .endCell();
}

export function changeAdmin(params: { newAdmin: Address }): Cell {
    return beginMessage({ op: new BN(3) })
        .storeAddress(params.newAdmin)
        .endCell();
}

export function changeContent(params: { newContent: Cell }): Cell {
    return beginMessage({ op: new BN(4) })
        .storeRef(params.newContent)
        .endCell();
}

export function callTo(params: { toAddress: Address; amount: BN; masterMsg: Cell }): Cell {
    return beginMessage({ op: new BN(6) })
        .storeAddress(params.toAddress)
        .storeCoins(params.amount)
        .storeRef(params.masterMsg)
        .endCell();
}

export function upgradeMinter(params: { newData: Cell; newCode: Cell }): Cell {
    return beginMessage({ op: new BN(5) })
        .storeRef(params.newData)
        .storeRef(params.newCode)
        .endCell();
}
