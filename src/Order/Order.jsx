import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

function Order() {
  const loc = useLocation();
  const nav = useNavigate();
  const cartBook = loc.state?.book || [];
  const [cardData, setCardData] = useState([]);
  const [addrData, setAddrData] = useState([]);
  const [cpnData, setCpnData] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedAddr, setSelectedAddr] = useState("");
  const [selectedCpn, setSelectedCpn] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);

  // 책의 총 가격과 수량 계산
  const totalPrice = cartBook.reduce(
    (acc, book) => acc + book.price * book.count,
    0
  );
  const totalCount = cartBook.reduce((acc, book) => acc + book.count, 0);

  useEffect(() => {
    axios.get("http://localhost:4000/order").then((res) => {
      const userCard = res.data[0].map((card) => ({
        num: card.card_num.toString(),
        info: card.card_info,
        date: card.card_date,
      }));
      setCardData(userCard);

      const userAddr = res.data[1].map((addr) => ({
        num: addr.address_num.toString(),
        def: addr.defalut_address,
        det: addr.detail_address,
      }));
      setAddrData(userAddr);

      const userCpn = res.data[2].map((cpn) => ({
        num: cpn.coupon_id.toString(),
        type: cpn.coupon_type,
        used: cpn.coupon_usetype,
        end: cpn.coupon_enddate,
      }));
      setCpnData(userCpn);

      setDiscountPrice(totalPrice);
    });
  }, [totalPrice]);

  const handleCardChange = (e) => {
    setSelectedCard(e.target.value);
  };

  const handleAddrChange = (e) => {
    setSelectedAddr(e.target.value);
  };

  const handleCpnChange = (e) => {
    const selectedCoupon = cpnData.find((cpn) => cpn.num === e.target.value);
    setSelectedCpn(e.target.value);

    if (selectedCoupon) {
      let discountedPrice = totalPrice;

      // 나중에는 받아온 값의 자료형에 따라 조건문 수정 가능
      if (selectedCoupon.type === "0.1") {
        discountedPrice = totalPrice * 0.9;
      } else if (selectedCoupon.type === "1000") {
        discountedPrice = totalPrice - 1000;
      }

      setDiscountPrice(Math.max(discountedPrice, 0));
    }
  };

  async function orderSubmit(e) {
    e.preventDefault();

    if (!selectedCard || !selectedAddr) {
      alert("카드와 주소를 선택해주세요.");
      return;
    }

    const selectedCardInfo = cardData.find((card) => card.num === selectedCard);
    const selectedAddrInfo = addrData.find((addr) => addr.num === selectedAddr);
    const selectedCpnInfo = cpnData.find((cpn) => cpn.num === selectedCpn);

    if (!selectedCardInfo || !selectedAddrInfo) {
      alert("선택한 카드 또는 주소 정보를 찾을 수 없습니다.");
      return;
    }
    if (!selectedCpnInfo) {
      await axios
        .post("http://localhost:4000/order", {
          books: cartBook,
          userCard: selectedCardInfo,
          userAddr: selectedAddrInfo,
          price: totalPrice,
          disprice: discountPrice,
          count: totalCount,
          info: 0,
        })
        .then((res) => {
          alert(res.data);
          nav("/my_page");
        });
    } else {
      await axios
        .post("http://localhost:4000/order", {
          books: cartBook,
          userCard: selectedCardInfo,
          userAddr: selectedAddrInfo,
          userCpn: selectedCpnInfo,
          price: totalPrice,
          disprice: discountPrice,
          count: totalCount,
          info: 1,
        })
        .then((res) => {
          alert(res.data);
          nav("/my_page");
        });
    }
  }

  return (
    <>
      <h2>주문 페이지</h2>
      <form onSubmit={orderSubmit}>
        {cartBook.length > 0 ? (
          <ul>
            {cartBook.map((book, index) => (
              <li key={index}>
                도서명: {book.name} <br />
                도서 가격: {book.price} <br />
                수량: {book.count}권
              </li>
            ))}
          </ul>
        ) : (
          <p>장바구니에 도서가 없습니다.</p>
        )}
        총 수량: {totalCount} <br />총 금액: {totalPrice}
        <h3>카드 선택</h3>
        {cardData.map((card, index) => (
          <div key={index}>
            <input
              type="radio"
              name="card"
              value={card.num}
              onChange={handleCardChange}
              checked={selectedCard === card.num}
            />
            <label>
              {card.info} (유효기간: {card.date}, 카드번호: {card.num})
            </label>
          </div>
        ))}
        <h3>주소 선택</h3>
        {addrData.map((addr, index) => (
          <div key={index}>
            <input
              type="radio"
              name="address"
              value={addr.num}
              onChange={handleAddrChange}
              checked={selectedAddr === addr.num}
            />
            <label>
              우편번호: {addr.num}, 기본주소: {addr.def}, 상세주소: {addr.det}
            </label>
          </div>
        ))}
        <h3>쿠폰 선택</h3>
        {cpnData.map((cpn, index) => (
          <div key={index}>
            <input
              type="radio"
              name="coupon"
              value={cpn.num}
              onChange={handleCpnChange}
              checked={selectedCpn === cpn.num}
            />
            <label>
              쿠폰 종류: {cpn.type}, 사용여부: {cpn.used}, 만료일: {cpn.end}
            </label>
          </div>
        ))}
        <div>할인 금액: {discountPrice}</div>
        <button type="submit">주문하기</button>
      </form>
    </>
  );
}

export default Order;
