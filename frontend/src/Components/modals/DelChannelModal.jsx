import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { delChannel } from '../../slices/channelsSlice.js';
import axios from 'axios';
import routes from '../../routes/routes.js';
import { useSelector, useDispatch } from 'react-redux';

const DelChannelModal = ({ showDelChannelModal, setShowDelChannelModal, channelId }) => {
  const handleClose = () => setShowDelChannelModal(false);
  const { token } = useSelector((state) => state.usersReducer);

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
            <Modal.Title>Удалить канал?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={handleDeleteChannelSubmit}
                    className="btn btn-danger">
            Удалить
            </Button>
          </Modal.Footer>
        </Form>     
      </Modal>
    </>
  );
}

export default DelChannelModal;