import axios from "axios";
import React, { useEffect, useState } from "react";

function MyPage() {
  const [name, setName] = useState(""); // 로그인한 유저 이름
  const [userId, setUserId] = useState("");
  const [cardNum, setCardNum] = useState(""); // 카드 번호
  const [cardInfo, setCardInfo] = useState(""); // 카드사
  const [cardDate, setCardDate] = useState(""); // 카드 유효기간
  const [addrNum, setAddrNum] = useState(""); // 우편번호
  const [addrDef, setAddrDef] = useState(""); // 기본 주소
  const [addrDet, setAddrDet] = useState(""); // 상세 주소

  const [userCard, setUserCard] = useState([]); // 불러온 카드 정보를 담는 배열
  const [userAddr, setUserAddr] = useState([]); // 불러온 주소 정보를 담는 배열

  // 마이페이지 get 요청
  useEffect(() => {
    const userSession = window.sessionStorage.getItem("session");
    const parSession = JSON.parse(userSession);
    const loginedUser = parSession.id;

    axios
      .get("http://localhost:4000/my_page", { withCredentials: true })
      .then((res) => {
        if (loginedUser === res.data[0][0].user_id) {
          setName(res.data[0][0].user_name);
          setUserId(res.data[0][0].user_id);
        }

        const cardData = res.data[1].map((card) => ({
          num: card.card_num,
          info: card.card_info,
          date: card.card_date,
        }));
        setUserCard(cardData);

        const addrData = res.data[2].map((addr) => ({
          num: addr.address_num,
          def: addr.defalut_address,
          det: addr.detail_address,
        }));
        setUserAddr(addrData);
      });
  }, [userCard, userAddr]);

  // 카드 정보 post 요청
  async function cardSubmit(e) {
    e.preventDefault();

    await axios
      .post("http://localhost:4000/card", {
        id: cardNum,
        info: cardInfo,
        date: cardDate,
        userId: userId,
      })
      .then((res) => {
        console.log(res.data.cardState);
      });
  }

  // 주소 post 요청
  async function addrSubmit(e) {
    e.preventDefault();

    await axios
      .post("http://localhost:4000/address", {
        num: addrNum,
        def: addrDef,
        det: addrDet,
        userId: userId,
      })
      .then((res) => {
        console.log(res.data.addrState);
      });
  }

  return (
    <>
      <h2>마이페이지 입니다.</h2>
      <div>회원정보</div>
      <li>{name}</li>
      <h3>카드 정보</h3>
      {userCard.map((card, index) => (
        <ul>
          <li key={index}>
            카드번호: {card.num} <br />
            카드사: {card.info} <br />
            유효기간: {card.date}
          </li>
        </ul>
      ))}
      <h3>배송지 정보</h3>
      {userAddr.map((addr, index) => (
        <ul>
          <li key={index}>
            우편번호: {addr.num} <br />
            기본주소: {addr.def} <br />
            상세주소: {addr.det}
          </li>
        </ul>
      ))}

      <form onSubmit={cardSubmit}>
        <span>카드 정보 기입</span>
        <input
          type="text"
          placeholder="카드 번호"
          value={cardNum}
          onChange={(e) => setCardNum(e.target.value)}
        />
        <input
          type="text"
          placeholder="카드사"
          value={cardInfo}
          onChange={(e) => setCardInfo(e.target.value)}
        />
        <input
          type="text"
          placeholder="유효기간"
          value={cardDate}
          onChange={(e) => setCardDate(e.target.value)}
        />
        <button type="submit">저장</button>
      </form>
      <form onSubmit={addrSubmit}>
        <span>배송지 정보 기입</span>
        <input
          type="text"
          placeholder="우편번호"
          value={addrNum}
          onChange={(e) => setAddrNum(e.target.value)}
        />
        <input
          type="text"
          placeholder="기본 주소"
          value={addrDef}
          onChange={(e) => setAddrDef(e.target.value)}
        />
        <input
          type="text"
          placeholder="상세 주소"
          value={addrDet}
          onChange={(e) => setAddrDet(e.target.value)}
        />
        <button type="submit">저장</button>
      </form>
    </>
  );
}

export default MyPage;
