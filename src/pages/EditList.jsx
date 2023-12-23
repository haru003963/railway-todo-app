import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom"; // Change import here
import { Header } from "../components/Header";
import { url } from "../const";
import "./editList.scss";

export const EditList = () => {
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const { listId } = useParams();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const handleTitleChange = (e) => setTitle(e.target.value);

  const onUpdateList = () => {
    const data = {
      title: title,
    };

    axios
      .put(`${url}/lists/${listId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate("/"); // Use navigate instead of history.push
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。 ${err}`);
      });
  };

  // Rest of your code remains the same
  // ...

  return (
    <div>
      <Header />
      <main className="edit-list">{/* ... */}</main>
    </div>
  );
};
