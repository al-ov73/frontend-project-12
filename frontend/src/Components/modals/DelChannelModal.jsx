import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import routes from '../../routes/routes.js';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DelChannelModal = ({ showDelChannelModal, setShowDelChannelModal, channelId }) => {
  const handleClose = () => setShowDelChannelModal(false);
  const token = useSelector((state) => state.users.token);
  const { t } = useTranslation();
  
  const handleDeleteChannelSubmit = async () => {
    try {
      axios.delete([routes.ChannelsPath(), channelId].join('/'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        handleClose();
        toast.success(t('toasts.NewChannelRemoved'));
      });
    } catch (e) {
      if (e.message === "Network Error") {
        toast.warn(t('toasts.NetworkError'));
      }
      console.log(e);
    }

  };

  return (
    <>
      <Modal show={showDelChannelModal} onHide={handleClose}>
        <Form>        
          <Modal.Header closeButton>
            <Modal.Title>{t('Delete_channel_?')}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={handleDeleteChannelSubmit}
                    className="btn btn-danger">
            {t('Remove')}
            </Button>
          </Modal.Footer>
        </Form>     
      </Modal>
    </>
  );
}

export default DelChannelModal;