import React, { useEffect, useState } from "react";
import axios from "axios";

function MainPage() {
  const checkSession = window.sessionStorage.getItem("session");
  //쿠폰은 메인 페이지에서 받음
  const intCoupon = 1000;
  const perCoupon = 0.1;
  const [bestSell, setBestSell] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/sales").then((res) => {
      const data = res.data;
      setBestSell(data);
    });
  }, []);

  function onClickPerCoupon() {
    if (checkSession != null) {
      axios.post("http://localhost:4000/", { per: perCoupon });
    } else {
      alert("로그인 하세요");
    }
  }

  function onClickIntCoupon() {
    if (checkSession != null) {
      axios.post("http://localhost:4000/", { int: intCoupon });
    } else {
      alert("로그인 하세요");
    }
  }

  return (
    <div>
      <h1>메인 페이지 입니다.</h1>
      <button onClick={onClickIntCoupon}>1000원 쿠폰 받기</button>
      <button onClick={onClickPerCoupon}>10% 쿠폰 받기</button>
      <h3>베스트 셀러</h3>
      {bestSell.map((best, idx) => (
        <ul>
          <li key={idx}>{best.book_name}</li>
        </ul>
      ))}
    </div>
  );
}

export default MainPage;
