// 라이브러리
import { useEffect, useState } from "react"

// 스타일
import styles from "./SingleHeader.module.css"

// 이미지
import hamburger from "/assets/icons/hamburgerbar.svg"
import bell from "/assets/icons/bell.png"

// 컴포넌트
import NeighborAcceptModal from "../../components/Modal/Neighbor/NeighborAcceptModal"
import DefaultModal from "../../components/Modal/Default/DefaultModal"
import { successMsg } from "../../utils/customToast"
import RoomNameBtn from "../../components/Button/Room/RoomNameBtn"



// API
import {
  fetchNeighborRequest,
  responseNeighborRequest,
  fetchNeighborList,
} from "../../api/Neighbor"
import { fetchLogout, fetchUserSecession } from "../../api/User"
import { fetchInquiry } from "../../api/Cs"


const SingleHeader = ({ checkMyRoom }) => {
  // 햄버거메뉴바 상태관리
  const [isHamburger, setIsHamburger] = useState(false)
  // 알림 상태관리
  const [isAlarm, setIsAlarm] = useState(false)
  // 알림 리스트 상태관리
  const [alarms, setAlarms] = useState([])
  // 알림 리스트 길이 상태관리
  const [alarmsLength, setAlarmsLength] = useState(0)
  // 이웃리스트 상태관리
  const [neighborList, setNeighborList] = useState([])
  // 이웃리스트 리스트 길이 상태관리
  const [neighborListLength, setNeighborListLength] = useState(0)
  // 문의하기 모달 상태관리
  const [isInquiry, setIsInquiry] = useState(false)
  // 문의하기 내용 상태관리
  const [inquiryText, setInquiryText] = useState("")
  // 로그아웃 확인 모달 상태관리
  const [isRealLogout, setIsRealLogout] = useState(false)
  // 회원탈퇴 확인 모달 상태관리
  const [isRealSecession, setIsRealSecession] = useState(false)

  // 유저정보

  const urlPath = import.meta.env.VITE_APP_ROUTER_URL

  // 유저요청 가져오기
  useEffect(() => {
    // 이웃 리스트
    fetchNeighborList(
      (success) => {
        setNeighborList(success.data.data)
        setNeighborListLength(success.data.data.length)
      },
      (error) => {
        console.log("Error at neighbor list...", error)
      }
    )
    // 이웃요청 리스트
    fetchNeighborRequest(
      (success) => {
        setAlarmsLength(success.data.data.length)
        setAlarms(success.data.data)
      },
      (error) => {
        console.log("Error at neighbor request...", error)
      }
    )
  }, [])

  // 이웃요청 수락함수
  const acceptNeighborHandler = (id) => {
    responseNeighborRequest(
      { flag: "Y", neighborId: id },
      (response) => {
        setAlarmsLength(alarmsLength - 1)
        setAlarms((prev) => prev.filter((alarm) => alarm.neighborId !== id))
        successMsg("✅ 이웃 수락이 완료됐습니다!")
      },
      (error) => {
        console.log("Error in ResponseNeighborRequest ...", error)
      }
    )
  }

  // 이웃요청 거절함수
  const refuseNeighborHandler = (id) => {
    responseNeighborRequest(
      { flag: "N", neighborId: id },
      (response) => {
        setAlarmsLength(alarmsLength - 1)
        setAlarms((prev) => prev.filter((alarm) => alarm.neighborId !== id))
        successMsg("✅ 이웃 거절이 완료됐습니다!")
      },
      (error) => {
        console.log("Error in ResponseNeighborRequest ...", error)
      }
    )
  }


  // 문의하기 함수
  const inquiryHandler = () => {
    fetchInquiry(
      {
        category: "3",
        content: inquiryText,
      },
      (success) => {
        setIsInquiry(false)
        setIsHamburger(false)
        successMsg("✅ 문의하기가 완료됐습니다!")
      },
      (error) => {
        "Error at inquiry...", error
      }
    )
  }

  // 로그아웃 함수
  const logoutHandler = () => {
    fetchLogout(
      (success) => {
        localStorage.removeItem("userAtom")
        window.location.replace(`${urlPath}/login`)
        successMsg("✅ 로그아웃 성공!")
      },
      (error) => {
        "Error at Logout...", error
      }
    )
  }

  // 회원탈퇴 함수
  const withdrawalHandler = () => {
    fetchUserSecession(
      (success) => {
        localStorage.removeItem("userAtom")
        window.location.replace(`${urlPath}/login`)
        successMsg("✅ 회원탈퇴 성공!")
      },
      (error) => {
        "Error at Secession...", error
      }
    )
  }

  // 문의하기 버튼함수
  const inquiryCheckHandler = () => {
    setIsHamburger(false)
    setIsInquiry(true)
  }

  return (
    <>
      <div className={styles.wrap}>
        <div
          className={
            checkMyRoom === "invite" ? styles.inviteHeader : styles.header
          }
        >
          {checkMyRoom === "invite" ? (
            <div className={styles.userName}>딩동 마을</div>
          ) : (
            <>
              <img
                src={hamburger}
                onClick={() => setIsHamburger(true)}
                className={styles.HamburgerButton}
              />
              <RoomNameBtn >
                딩동 마을
              </RoomNameBtn >
              {/* </div> */}
              <img src={bell} onClick={() => setIsAlarm(true)} />
            </>
          )}
        </div>
      </div>

      {/* 햄버거 바 */}
      {isHamburger && (
        <>
          <div
            className={styles.Overlay}
            onClick={() => setIsHamburger(false)}
          />
          <div className={styles.HamburgerModal}>
            <div className={styles.ContentContainer}>
              <div
                className={styles.MenuButton}
                onClick={inquiryCheckHandler}
              >
                문의하기
              </div>
              <div className={styles.MenuButton} onClick={() => setIsRealLogout(true)}>
                로그아웃
              </div>
              <div className={styles.MenuButton} onClick={() => setIsRealSecession(true)}>
                회원탈퇴
              </div>
            </div>
          </div>
        </>
      )}

      {/* 알림 */}
      {isAlarm && (
        <>
          <div className={styles.Overlay} onClick={() => setIsAlarm(false)} />
          <div className={styles.AlarmContainer}>
            <div className={styles.xButtonContainer}>
              <img
                src={`${urlPath}/assets/icons/x.png`}
                className={styles.AlarmX}
                onClick={() => setIsAlarm(false)}
              />
            </div>
            {alarmsLength !== 0 ? (
              <div className={styles.alarmListContainer}>
                {alarms.map((alarm) => (
                  <div key={alarm.neighborId} className={styles.AlarmModal}>
                    <NeighborAcceptModal
                      content={alarm.nickname}
                      okClick={() => acceptNeighborHandler(alarm.neighborId)}
                      cancelClick={() =>
                        refuseNeighborHandler(alarm.neighborId)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.NoAlarm}>알림이 없습니다!</div>
            )}
          </div>
        </>
      )}


      {/* 문의하기 모달 */}
      {isInquiry && (
        <>
          <div
            className={styles.RemoveOverlay}
            onClick={() => setIsInquiry(false)}
          />
          <div className={styles.InquiryContainer}>
            <div className={styles.InquiryTitle}>문의하기</div>
            <textarea
              className={styles.InquiryContent}
              placeholder="문의할 내용을 작성해주세요."
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              maxLength={199}
            />
            <div className={styles.InquiryTextLength}>
              {inquiryText.length}/200
            </div>
            <div className={styles.Inquiry} onClick={inquiryHandler}>
              완료
            </div>
          </div>
        </>
      )}

      {/* 로그아웃 확인 모달 */}
      {isRealLogout && (
        <>
          <div
            className={styles.RemoveOverlay}
            onClick={() => setIsRealLogout(false)}
          />
          <div className={styles.RemoveNeighborContainer}>
            <DefaultModal
              content={"정말 로그아웃을 하시겠습니까?"}
              ok={"네"}
              cancel={"아니오"}
              okClick={logoutHandler}
              cancelClick={() => setIsRealLogout(false)}
            />
          </div>
        </>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {isRealSecession && (
        <>
          <div
            className={styles.RemoveOverlay}
            onClick={() => setIsRealSecession(false)}
          />
          <div className={styles.RemoveNeighborContainer}>
            <DefaultModal
              content={"정말 회원탈퇴를 하시겠습니까?"}
              ok={"네"}
              cancel={"아니오"}
              okClick={withdrawalHandler}
              cancelClick={() => setIsRealSecession(false)}
            />
          </div>
        </>
      )}
    </>
  )
}

export default SingleHeader
