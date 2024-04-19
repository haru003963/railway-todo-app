import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { url } from "../const";
import { useNavigate, useParams } from "react-router-dom";
import "./editTask.scss";
import * as dayjs from "dayjs";

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  //APIから取得した期限の情報を入れるstate（フォーマットはnew Date）
  const [deadline, setDeadline] = useState(new Date());
  //期限を表示するときのstate（フォーマットはdayjs）
  const [formattedDeadline, setFormattedDeadline] = useState(
    dayjs().format("YYYY-MM-DD HH:MM")
  );

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");

  //期限の値が変更されたらその値のフォーマットを整えてstateに入れる
  const handleDeadlineChange = (e) => {
    setDeadline(new Date(e.target.value));
    setFormattedDeadline(dayjs(e.target.value).format("YYYY-MM-DD HH:MM"));
  };

  //更新した時に動く処理
  const onUpdateTask = () => {
    console.log(isDone);
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: deadline, // 期限日時の値をデータに追加
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  //サーバーから情報を受け取る処理
  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setIsDone(task.done);
        setDeadline(new Date(task.limit));
        // setDeadline(dayjs(task.limit).format("YYYY-MM-DDTHH:MM:SSZ"));
        console.log(deadline);
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, []);

  //deadlineが変更された時に、setFormattedDeadlineにdeadlineの値を入れる
  useEffect(() => {
    setFormattedDeadline(dayjs(deadline).format("YYYY-MM-DD HH:MM"));
    console.log(formattedDeadline);
  }, [deadline]);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限</label>
          <input
            type="datetime-local"
            onChange={handleDeadlineChange}
            value={formattedDeadline}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? "checked" : ""}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? "checked" : ""}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
