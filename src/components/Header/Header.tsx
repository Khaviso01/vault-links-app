import Logo from '../../assets/images/vault-link-logo.png'
import './Header.css'

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-logo' onClick={scrollToTop}>
          <img src={Logo} alt="Link Vault Logo" className="navbar-logo" />
        </div>
      </div>
    </nav>
  )
}

export default Header