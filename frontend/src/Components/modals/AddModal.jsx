import { FormikProvider, useFormik, ErrorMessage } from "formik";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import routes from '../../routes/routes.js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

var filter = require('leo-profanity');

const AddModal = ({ showAddModal, setShowAddModal, setActiveChannelId }) => {
  const token = useSelector((state) => state.usersReducer.token);
  const { t, i18n } = useTranslation();

  const handleClose = () => setShowAddModal(false);

  const handleNewChannelSubmit = (values, actions) => {
    const censoredChannelName = filter.clean(values.channelName);
    const newChannel = { name: censoredChannelName };
    try {
      axios.post(routes.ChannelsPath(), newChannel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setShowAddModal(false);
        setActiveChannelId(response.data.id);
        toast.success(t('toasts.NewChannelCreate'));
      });
    } catch (e) {
      if (e.message === "Network Error") {
        toast.warn(t('toasts.NetworkError'));
      }
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: (values, actions) => handleNewChannelSubmit(values, actions),
  });

  return (
    <>
      <Modal show={showAddModal} onHide={handleClose}>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>        
            <Modal.Header closeButton>
              <Modal.Title>{t('Add_channel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label className="visually-hidden">Имя канала</Form.Label>
                <Form.Control type="channelName"
                  placeholder={t('Channel_name')}
                  autoComplete="channelName"
                  id="channelName"
                  onChange={formik.handleChange}
                  value={formik.values.channelName}
                  class="mb-2 form-control"
                />
                <ErrorMessage name="name" className="invalid-feedback" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button"
                      className="me-2 btn btn-secondary"
                      onClick={() => setShowAddModal(false)}>
              {t('Cancel')}
              </Button>
              <Button type="submit"
                      className="btn btn-primary">
              {t('Send')}
              </Button>
            </Modal.Footer>
          </Form>
        </FormikProvider>        
      </Modal>
    </>
  );
}

export default AddModal;