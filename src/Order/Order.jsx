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
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedAddr, setSelectedAddr] = useState("");
  let bookPriceArr = cartBook.map((book) => book.price);
  let bookCountArr = cartBook.map((book) => book.count);
  let totalPrice = 0;
  let totalCount = 0;
  for (let i = 0; i < bookPriceArr.length; i++) {
    totalPrice += bookPriceArr[i];
    totalCount += Number(bookCountArr[i]);
  }

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
    });
  }, []);

  const handleCardChange = (e) => {
    setSelectedCard(e.target.value);
  };

  const handleAddrChange = (e) => {
    setSelectedAddr(e.target.value);
  };

  async function orderSubmit(e) {
    e.preventDefault();

    if (!selectedCard || !selectedAddr) {
      alert("카드와 주소를 선택해주세요.");
      return;
    }

    const selectedCardInfo = cardData.find((card) => card.num === selectedCard);
    const selectedAddrInfo = addrData.find((addr) => addr.num === selectedAddr);

    if (!selectedCardInfo || !selectedAddrInfo) {
      alert("선택한 카드 또는 주소 정보를 찾을 수 없습니다.");
      return;
    }

    await axios
      .post("http://localhost:4000/order", {
        books: cartBook,
        userCard: selectedCardInfo,
        userAddr: selectedAddrInfo,
        price: totalPrice,
        count: totalCount,
      })
      .then((res) => {
        alert(res.data);
        nav("/my_page");
      });
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
        <button type="submit">주문하기</button>
      </form>
    </>
  );
}

export default Order;
