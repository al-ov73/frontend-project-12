import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes/routes.js';
import Form from 'react-bootstrap/Form';
import { FormikProvider, useFormik } from "formik";
import AddModal from './modals/AddModal.jsx';
import DelChannelModal from './modals/DelChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';
import { ModalContext } from '../contexts/index.jsx';
import { useContext } from 'react'
import { setChannels, delChannel, renameChannel } from '../slices/channelsSlice.js';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { removeCredentials } from '../slices/usersSlice.js';
import useAuth from '../hooks/index.jsx';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const { io } = require("socket.io-client");
const socket = io('http://localhost:5001');
var filter = require('leo-profanity');

const IndexPage = () => {
  const dispatch = useDispatch()
  const auth = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { token, username } = useSelector((state) => state.usersReducer);
  
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
      });
    } catch (e) {
      if (e.message === "Network Error") {
        toast.warn(t('toasts.NetworkError'));
      }
      console.log(e);
    }
  }
  
  const setChannelsList = (token) => async (dispatch) => {
    const response = await axios.get(routes.ChannelsPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setChannels(response.data));
  }

  useEffect(() => {
    dispatch(setChannelsList(token))
  }, []);

  const channels = useSelector((state) => state.channels.channels, []);

  const [messages, setMessages] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState('1');
  const [deleteChannelId, setDeleteChannelId] = useState('1');

  const activeChannel = channels.find((channel) => channel.id === activeChannelId);
  console.log('activeChannel', activeChannel)

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDelChannelModal, setShowDelChannelModal] = useState(false);
  const [showRenameChannelModal, setShowRenameChannelModal] = useState(false);

  const handleDeleteChannel = (channelId) => {
    setDeleteChannelId(channelId);
    setShowDelChannelModal(true)
  }

  const handleLogout = () => {
    dispatch(removeCredentials);
    auth.loggedIn = false;
    return navigate('login');
  }

  // const handleDeleteMassage = async (channelId) => {
  //   axios.delete([routes.MessagesPath(), , {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((response) => {
  //     console.log(response.data); // => { id: '3' }
  //   });
  //   const newMessages = messages.filter((message) => message.channelId !== id);
  //   setMessages(newMessages)
  // }

  useEffect(() => {
    getMessagesList(token).then((messages) => setMessages(messages));
  }, []);

  socket.on('newMessage', (payload) => {
    setMessages([...messages, payload])
  });

  socket.on('newChannel', (payload) => {
    dispatch(setChannels([...channels, payload]))
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(delChannel(id));
    setActiveChannelId('1');
  });

  socket.on('renameChannel', (payload) => {
    dispatch(renameChannel(payload));
  });

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: (messageObject, { resetForm }) => {
      messageObject.message = filter.clean(messageObject.message);
      handleMessageSubmit(token, {
        body: messageObject,
        channelId: activeChannelId,
        username,
      });
      resetForm();
    },
  });

  return <>
        <ToastContainer />
        <div class='d-flex flex-column h-100'>
          <nav class="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div class="container">
              <a class="navbar-brand" href="/">
                Hexlet Chat
              </a>
              <Button type="button" onClick={handleLogout} className="btn btn-primary">
                {t('Logout')}
              </Button>
            </div>
          </nav>


    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('Channels')}</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => setShowAddModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span className="visually-hidden">+</span>
              </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => {
              let btnClasses = "w-100 rounded-0 text-start text-truncate btn";
              let dropMenuBtnClasses = "flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
              if (channel.id === activeChannelId) {
                btnClasses += ' btn-secondary'
                dropMenuBtnClasses += ' btn-secondary'
              }
              let dropdownMenuId = `dropdownMenuButton${channel.id}`
              return <>
                <li className="nav-item w-100">
                  <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
                    <Button type="button" onClick={() => setActiveChannelId(channel.id)} className={btnClasses}>
                      <span className="me-1">
                        #
                      </span>
                      {channel.name}
                    </Button>
                    
                    {channel.removable && <>
                    <Dropdown.Toggle split className={dropMenuBtnClasses} id={dropdownMenuId}>
                    <span class="visually-hidden">{t('Channel management')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleDeleteChannel(channel.id)}>{t('Remove')}</Dropdown.Item>
                      {showDelChannelModal && <DelChannelModal showDelChannelModal={showDelChannelModal} setShowDelChannelModal={setShowDelChannelModal} channelId={deleteChannelId}/>}

                      <Dropdown.Item onClick={() => setShowRenameChannelModal(true)}>{t('Rename')}</Dropdown.Item>
                      {showRenameChannelModal && <RenameChannelModal showRenameChannelModal={showRenameChannelModal} setShowRenameChannelModal={setShowRenameChannelModal} channel={channel}/>}

                    </Dropdown.Menu>
                    </>}
                  </Dropdown>
                </li>
              </>
            })}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0"><b># {activeChannel && activeChannel.name}</b></p>
              <span className="text-muted">0 сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              {messages.map((message) => {
                if (message.channelId === activeChannelId) {
                  return <>
                    <div class="text-break mb-2"><b>{message.username}</b>: {message.body.message}</div>
                  </>
                }
              })}
            </div>
            <div className="mt-auto px-5 py-3">

            <FormikProvider value={formik}>
              <Form onSubmit={formik.handleSubmit} novalidate="" className="py-1 border rounded-2"> 
                <Form.Group className="input-group has-validation">
                <Form.Control
                  aria-label="Новое сообщение"
                  placeholder=""
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
  </div>
  {showAddModal && <AddModal showAddModal={showAddModal} setShowAddModal={setShowAddModal} />}
  
  </>
};

export default IndexPage;
