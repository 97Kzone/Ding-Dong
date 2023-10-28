import { useSetRecoilState } from "recoil"
import {
  ArriveAtom,
  ConfirmEnteringRoomAtom,
} from "../../../atom/SinglePlayAtom"
import { DefaultPosition, DefaultZoom } from "../../../atom/DefaultSettingAtom"
import DefaultModal from "../Default/DefaultModal"

const ConfirmEnteringRoomModal = () => {
  // 기본 카메라 설정
  const setDefaultCameraPosition = useSetRecoilState(DefaultPosition)
  const setDefaultCameraZoom = useSetRecoilState(DefaultZoom)

  // 입장 여부
  const setConfirmEnteringHouse = useSetRecoilState(ConfirmEnteringRoomAtom)

  // 도착 여부
  const setIsArrived = useSetRecoilState(ArriveAtom)

  // 마이룸으로 이동
  const onConfirm = () => {
    setConfirmEnteringHouse(false)
  }

  const onCancle = () => {
    setConfirmEnteringHouse(false)
    setIsArrived(false)

    // 기본 값 설정
    setDefaultCameraPosition([1, 5, 5])
    setDefaultCameraZoom(0.17)
  }

  return (
    <DefaultModal
      content={"마이룸으로 이동 하시겠습니까?"}
      ok={"확인"}
      cancel={"취소"}
      cancelClick={onCancle}
      okClick={onConfirm}
    />
  )
}

export default ConfirmEnteringRoomModal