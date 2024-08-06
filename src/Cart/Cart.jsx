import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function Cart() {
  const [book, setBook] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/cart").then((res) => {
      const data = res.data;
      const cartData = data.map((book) => ({
        name: book.book_name,
        price: book.book_price,
        count: book.count_book,
      }));
      setBook(cartData);
    });
  }, []);

  return (
    <>
      <h2>장바구니 페이지</h2>
      {book.map((book, index) => (
        <ul>
          <li key={index}>
            도서명: {book.name} <br />
            도서 가격:{book.price} <br />
            수량: {book.count}권<button>+</button>
            <button>-</button>
          </li>
        </ul>
      ))}
      <button onClick={() => nav("/order", { state: { book } })}>
        구매하러 가기
      </button>
    </>
  );
}

export default Cart;
