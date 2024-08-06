import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function Book() {
  const [bookData, setBookData] = useState([]);
  const [loginedUser, setLoginedUser] = useState("");
  const sessionUser = JSON.parse(window.sessionStorage.getItem("session"));
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/book")
      .then((res) => {
        try {
          const data = res.data;
          const newBookData = [];
          for (let i = 0; i < data[0].length; i++) {
            if (i + 1 === data[0][i].book_id) {
              newBookData.push({
                id: data[0][i].book_id,
                book_name: data[0][i].book_name,
                book_inventory: data[0][i].book_inventory,
                book_price: data[0][i].book_price,
              });
            }
          }
          setBookData(newBookData);
          setLoginedUser(data[1]);
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function onClickCart(book) {
    if (loginedUser === sessionUser.id)
      axios.post("http://localhost:4000/cart_book", book).then((res) => {
        console.log(res.data.cartState.state);
      });
  }

  function onClickOrder(book) {
    nav("/order", {
      state: {
        book: [{ name: book.book_name, price: book.book_price, count: 1 }],
      },
    });
  }

  return (
    <>
      <h2>도서 정보 페이지</h2>
      {bookData.map((book) => (
        <ul>
          <li key={book.id}>
            도서명: {book.book_name} <br /> 재고량: {book.book_inventory}권
            <br /> 가격: {book.book_price}원
            <button onClick={() => onClickCart(book)}>장바구니</button>
            <button onClick={() => onClickOrder(book)}>바로 구매</button>
          </li>
        </ul>
      ))}
    </>
  );
}

export default Book;
