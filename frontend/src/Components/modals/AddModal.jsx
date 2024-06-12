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

  if (showAddModal) {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
  if (!showAddModal) {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

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
    <div role="dialog" aria-modal="true" class="fade modal show" tabindex="-1" style={{display: "block"}}>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title h4">
              Добавить канал
            </div>
            <Button type="button"
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    className="btn btn-close"
                    onClick={() => setShowAddModal(false)}>
            </Button>
          </div>
          <div class="modal-body">
            <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <div>
                <Form.Group>
                  <Form.Label className="visually-hidden">Имя канала</Form.Label>
                    <Form.Control type="name"
                      placeholder="Имя канала"
                      autoComplete="name"
                      id="name"
                      onChange={formik.handleChange}
                      value={formik.values.channelName}
                      class="mb-2 form-control"
                      />
                    <ErrorMessage name="name" className="invalid-feedback" />
                  </Form.Group>
                <div class="d-flex justify-content-end">
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
            </Form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default AddModal;