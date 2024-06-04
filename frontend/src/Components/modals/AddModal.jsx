import { FormikProvider, useFormik, ErrorMessage } from "formik";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ModalContext } from '../../contexts/index.jsx';
import routes from '../../routes/routes.js';
import { useContext } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddModal = () => {
  const [showAddModal, setShowAddModal] = useContext(ModalContext)
  const token = useSelector((state) => state.usersReducer.token);

  const handleNewChannelSubmit = (values, actions) => {
    const newChannel = { name: values.channelName };
    try {
      axios.post(routes.ChannelsPath(), newChannel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        setShowAddModal(false)
      });
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: (values, actions) => handleNewChannelSubmit(values, actions),
  });

  return <>
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
            <div className="modal-title h4">
              Добавить канал
            </div>
            <Button type="button"
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    className="btn btn-close"
                    onClick={() => setShowAddModal(false)}>
            </Button>
          </div>
          <div className="modal-body">
            <Form.Group>
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
              <Form.Control type="channelName"
                placeholder="Имя канала"
                autoComplete="channelName"
                id="channelName"
                onChange={formik.handleChange}
                value={formik.values.channelName}
                />
              <ErrorMessage name="channelName" className="invalid-feedback" />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="button"
                      className="me-2 btn btn-secondary"
                      onClick={() => setShowAddModal(false)}>
              Отменить
              </Button>
              <Button type="submit"
                      className="btn btn-primary">
              Отправить
              </Button>
            </div>

            </div>
          </div>
        </div>
      </Form>
    </FormikProvider>
  </>
}

export default AddModal;