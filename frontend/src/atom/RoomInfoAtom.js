import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const roomInfoAtom = atom({
    key: "roomInfoAtom",
    default: ""
});

export { roomInfoAtom };