import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes/routes.js';
import Form from 'react-bootstrap/Form';
import { FormikProvider, useFormik } from "formik";

const getChannelsList = async (token) => {
  try {
    const response = await axios.get(routes.ChannelsPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

const getMessagesList = async (token) => {
  try {
    const response = await axios.get(routes.MessagesPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

const handleMessageSubmit = async (token, newMessage) => {
  try {
    axios.post(routes.MessagesPath(), newMessage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      console.log(response.data);
    });
  } catch (e) {
    console.log(e);
  }
}

const IndexPage = () => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);

  const token = useSelector((state) => state.usersReducer.token);
  const username = useSelector((state) => state.usersReducer.username);

  useEffect(() => {
    getChannelsList(token).then((channels) => setChannels(channels));
  }, []);

  useEffect(() => {
    getMessagesList(token).then((messages) => setMessages(messages));
  }, []);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: (messageText, { resetForm }) => {
      handleMessageSubmit(token, {
        body: messageText,
        channelId: '1',
        username
      });
      resetForm();
    },
  });

  return <>
  {/* <body className="h-100 bg-light" style="">
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
              <button type="button" className="btn btn-primary">Выйти</button>
            </div>
          </nav> */}
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>Каналы</b>
                  <button type="button" className="p-0 text-primary btn btn-group-vertical">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span className="visually-hidden">+</span>
                    </button>
                </div>
                <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                  {channels.map((channel) => {
                    return <>
                    <li className="nav-item w-100">
                    <button type="button" className="w-100 rounded-0 text-start btn">
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                  </li>
                  </>
                  })}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0"><b># random</b></p>
                    <span className="text-muted">0 сообщений</span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                    {messages.map((message) => {
                      <div class="text-break mb-2"><b>admin</b>: {message.body}</div>
                    })}
                  </div>
                  <div className="mt-auto px-5 py-3">

                  <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit} novalidate="" className="py-1 border rounded-2"> 
                      <Form.Group className="input-group has-validation">
                      <Form.Control
                        aria-label="Новое сообщение"
                        placeholder="Введите сообщение..."
                        autoComplete="message"
                        id="message"
                        name="message"
                        type="text"
                        className="border-0 p-0 ps-2"
                        onChange={formik.handleChange}
                        value={formik.values.message} />
                        
                        <button type="submit" disabled="" className="btn btn-group-vertical">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                          </svg>
                          <span className="visually-hidden">Отправить</span>
                          </button>

                      </Form.Group>
                    </Form>
                  </FormikProvider>

                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div>
        <div className="Toastify"></div>
      </div>
    </div>
  </body> */}
  </>
};

export default IndexPage;