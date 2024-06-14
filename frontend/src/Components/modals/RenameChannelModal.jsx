import { FormikProvider, useFormik, ErrorMessage } from "formik";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import routes from '../../routes/routes.js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RenameChannelModal = ({ showRenameChannelModal, setShowRenameChannelModal, channel }) => {
  const token = useSelector((state) => state.usersReducer.token);
  const { t, i18n } = useTranslation();
  const handleClose = () => setShowRenameChannelModal(false);

  const handleRenameChannelSubmit = (values, actions) => {
    const editedChannel = { name: values.newName };
    try {
      axios.patch([routes.ChannelsPath(), channel.id].join('/'), editedChannel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        handleClose();
        toast.success(t('toasts.NewChannelRenamed'));
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
      newName: channel.name,
    },
    onSubmit: (values, actions) => handleRenameChannelSubmit(values, actions),
  });

  return (
    <>
      <Modal show={showRenameChannelModal} onHide={handleClose}>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>        
            <Modal.Header closeButton>
              <Modal.Title>{t('Rename_channel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label className="visually-hidden">Имя канала</Form.Label>
                <Form.Control type="newName"
                  placeholder={t('Channel_name')}
                  autoComplete="newName"
                  id="newName"
                  onChange={formik.handleChange}
                  value={formik.values.newName}
                  class="mb-2 form-control"
                />
                <ErrorMessage name="name" className="invalid-feedback" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button"
                      className="me-2 btn btn-secondary"
                      onClick={() => setShowRenameChannelModal(false)}>
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

export default RenameChannelModal;