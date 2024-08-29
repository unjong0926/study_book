import React from "react";
import axios from "axios";

function MainPage() {
  const checkSession = window.sessionStorage.getItem("session");
  //쿠폰은 메인 페이지에서 받음
  const intCoupon = 1000;
  const perCoupon = 0.1;

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
    </div>
  );
}

export default MainPage;
