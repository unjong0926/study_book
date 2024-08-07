import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [userName, setUserName] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (userPw === checkPw) {
      await axios
        .post("http://localhost:4000/sign_up", {
          id: userId,
          pw: userPw,
          userName: userName,
        })
        .then((res) => {
          console.log(res.data.signState.state);
        });
    } else {
      console.log("실패");
    }
  } //백엔드로 input태그에 입련된 정보를 넘겨주는 함수

  function navMain() {
    alert("회원가입 완료! 메인 페이지로 이동합니다.");
    nav("/");
  }

  return (
    <>
      <div>회원가입</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="성명"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="회원 아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="비밀번호"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="비밀번호 확인"
          value={checkPw}
          onChange={(e) => setCheckPw(e.target.value)}
          required
        />
        <button type="submit" onClick={navMain}>
          가입하기
        </button>
      </form>
    </>
  );
}

export default SignUp;
