import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { delChannel } from '../../slices/channelsSlice.js';
import axios from 'axios';
import routes from '../../routes/routes.js';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DelChannelModal = ({ showDelChannelModal, setShowDelChannelModal, channelId }) => {
  const handleClose = () => setShowDelChannelModal(false);
  const { token } = useSelector((state) => state.usersReducer);
  const { t, i18n } = useTranslation();
  
  const handleDeleteChannelSubmit = async () => {
    axios.delete([routes.ChannelsPath(), channelId].join('/'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(handleClose);
  };

  return (
    <>
      <Modal show={showDelChannelModal} onHide={handleClose}>
        <Form>        
          <Modal.Header closeButton>
            <Modal.Title>{t('Delete_channel_')}</Modal.Title>
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