import { useTranslation } from 'react-i18next';
import NavbarPage from './Navbar.jsx';

const Error404Page = () => {
  const { t } = useTranslation();
  return <>
      <NavbarPage />
      <h3>{t('404page')}</h3>
    </>
};
  
export default Error404Page;