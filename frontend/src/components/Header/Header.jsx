import { useLocation } from 'react-router-dom';
import ButtonLink from "../Button/Button.jsx";
import Logo from "../Logo/Logo.jsx";
import homeIcon from '../../assets/images/Header/home.svg';
import homeIconActive from '../../assets/images/Header/home-active.svg';
import searchIcon from '../../assets/images/Header/search.svg';
import searchIconActive from '../../assets/images/Header/search-active.svg';
import chatIcon from '../../assets/images/Header/chat.svg';
import chatIconActive from '../../assets/images/Header/chat-active.svg';
import profileIcon from '../../assets/images/Header/profile.svg';
import profileIconActive from '../../assets/images/Header/profile-active.svg';

const navItems = [
    { path: '/', icon: homeIcon, iconActive: homeIconActive },
    { path: '/search', icon: searchIcon, iconActive: searchIconActive },
    { path: '/chat', icon: chatIcon, iconActive: chatIconActive },
    { path: '/profile', icon: profileIcon, iconActive: profileIconActive },
];

export default function Header() {
    const { pathname } = useLocation();

    return (
        <>
            <header className="header container">
                <div className="header__inner">
                    <nav className="header__nav">
                        <ul className="header__nav-list">
                            {navItems.map(({ path, icon, iconActive }) => {
                                const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
                                const iconSrc = isActive ? iconActive : icon;
                                return (
                                    <li key={path} className="header__nav-item">
                                        <ButtonLink
                                            className={`header__nav-link${isActive ? ' header__nav-link--active' : ''}`}
                                            to={path}
                                        >
                                            <img src={iconSrc} width={60} height={60} loading='lazy' alt="icon" className="header__nav-icon"/>
                                        </ButtonLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="header__logo">
                        <Logo className={'logo__image'} />
                    </div>
                </div>
            </header>
        </>
    );
}
