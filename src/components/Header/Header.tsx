import Logo from '../../assets/images/vault-link-logo.png'
import './Header.css'

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-brand' onClick={scrollToTop}>
          <img src={Logo} alt="Link Vault Logo" className="navbar-logo" />
          <span className='brand-text'>Link Vault</span>
        </div>
        
        <div className="navbar-info">
          <span className='tagline'>Personalized Bookmark Manager</span>
        </div>
      </div>
    </nav>
  )
}

export default Header