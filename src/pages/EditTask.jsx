import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom"; // Change import here
import { url } from "../const";
import "./editTask.scss";

export const EditTask = () => {
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");

  const onUpdateTask = () => {
    console.log(isDone);
    const data = {
      title: title,
      detail: detail,
      done: isDone,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate("/"); // Use navigate instead of history.push
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  // Rest of your code remains the same
  // ...

  return (
    <div>
      <Header />
      <main className="edit-task">{/* ... */}</main>
    </div>
  );
};
