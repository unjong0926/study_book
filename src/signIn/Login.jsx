import axios from "axios";
import React, { useEffect, useState } from "react";
import Session from "react-session-api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const checkSession = window.sessionStorage.getItem("session");

  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (userPw) {
      try {
        const res = await axios.post(
          "http://localhost:4000/login",
          {
            id: userId,
            pw: userPw,
          },
          { withCredentials: true }
        );

        if (res.data.login.state) {
          Session.set("user_info", { id: userId, pw: userPw });
          window.sessionStorage.setItem(
            "session",
            JSON.stringify({ id: userId, pw: userPw })
          );
          alert("로그인이 완료되었습니다.");
          nav("/");
        } else {
          console.log("로그인 실패");
          alert("로그인 할 수 없습니다.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("로그인 중 오류가 발생했습니다.");
      }
    } else {
      console.log("비밀번호를 입력하세요.");
      alert("비밀번호를 입력하세요.");
    }
  }

  useEffect(() => {
    if (checkSession) {
      const loginInfo = JSON.parse(checkSession);
      Session.set("user_info", loginInfo);
    }
  }, [checkSession]);

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
        />
        <button type="submit">확인</button>
      </form>
    </>
  );
}

export default Login;
