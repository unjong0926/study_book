import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const checkSession = window.sessionStorage.getItem("session");
  const nav = useNavigate();

  function onClickLogin() {
    if (checkSession != null) {
      alert("이미 로그인이 되어있습니다. 메인으로 이동합니다.");
      nav("/");
    } else {
      nav("/login");
    }
  }

  function onClickMyPage() {
    if (checkSession == null) {
      alert("로그인해야합니다.");
      nav("/login");
    } else {
      nav("/my_page");
    }
  }

  async function onClickLogout() {
    try {
      await axios.post("http://localhost:4000/logout");
      window.sessionStorage.removeItem("session");
      alert("로그아웃 되었습니다.");
      nav("/");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다.", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  }

  function onClickOrderPage() {
    if (checkSession == null) {
      alert("로그인해야합니다.");
      nav("/login");
    } else {
      nav("/order_page");
    }
  }

  return (
    <>
      <div id="links">
        <Link to="/" style={{ textDecoration: "none" }}>
          메인
        </Link>
        <span to="/login" onClick={onClickLogin}>
          로그인
        </span>
        <Link to="/sign_up" style={{ textDecoration: "none" }}>
          회원가입
        </Link>
        <span onClick={onClickMyPage}>마이 페이지</span>
        <Link to="/cart" style={{ textDecoration: "none" }}>
          장바구니
        </Link>
        <Link to="/book" style={{ textDecoration: "none" }}>
          도서 정보
        </Link>
        <span onClick={onClickOrderPage}>주문 내역</span>
        <button onClick={onClickLogout}>로그아웃</button>
      </div>
    </>
  );
}

export default Header;
