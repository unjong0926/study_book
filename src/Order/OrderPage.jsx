import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

function OrderPage() {
  const [name, setName] = useState("");
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/order_page").then((res) => {
      console.log(res.data);
      const data = res.data;
      const list = data[0].map((order) => ({
        date: order.order_date,
        price: order.order_total,
        count: order.detail_info,
        card: order.user_card_info,
        defAddr: order.user_default_address,
        detAddr: order.user_detail_address,
        book: order.book_name,
      }));
      setOrderList(list);
      setName(data[1][0].user_name);
      console.log(list);
    });
  }, []);
  return (
    <>
      <h2>{name}님의 주문내역 페이지</h2>
      {orderList.map((order, idx) => (
        <ul>
          <li key={idx}>
            주문 일자: {order.date} <br />
            주문 도서: {order.book + " " + order.count + "권"} <br />
            주문 금액: {order.price + "원"} <br />
            배송지: {order.defAddr + ", " + order.detAddr} <br />
            카드 정보: {order.card} <br />
          </li>
        </ul>
      ))}
    </>
  );
}

export default OrderPage;
