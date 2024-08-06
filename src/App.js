import React from "react";
import Header from "./Header";
import MainPage from "./main/MainPage";
import SignUp from "./signUp/SignUp";
import Login from "./signIn/Login";
import Book from "./book/Book";
import MyPage from "./MyPage/MyPage";
import Cart from "./Cart/Cart";
import Order from "./Order/Order";
import OrderPage from "./Order/OrderPage";
import { BrowserRouter ,Route,Routes } from "react-router-dom";


function App() {


  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/book" element={<Book/>}/>
        <Route path="/my_page" element={<MyPage/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/order_page" element={<OrderPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
