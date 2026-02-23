import { useLocation } from 'react-router-dom';
import ButtonLink from '../Button/Button.jsx';
import Logo from '../Logo/Logo.jsx';
import homeIcon from '../../assets/images/Header/home.svg';
import homeIconActive from '../../assets/images/Header/home-active.svg';
import searchIcon from '../../assets/images/Header/search.svg';
import searchIconActive from '../../assets/images/Header/search-active.svg';
import chatIcon from '../../assets/images/Header/chat.svg';
import chatIconActive from '../../assets/images/Header/chat-active.svg';
import profileIcon from '../../assets/images/Header/profile.svg';
import profileIconActive from '../../assets/images/Header/profile-active.svg';
import homeIconMobile from '../../assets/images/Header/Adapt/home.svg';
import searchIconMobile from '../../assets/images/Header/Adapt/search.svg';
import chatIconMobile from '../../assets/images/Header/Adapt/chat.svg';
import profileIconMobile from '../../assets/images/Header/Adapt/profile.svg';

const navItems = [
    { path: '/feed', icon: homeIcon, iconActive: homeIconActive, iconMobile: homeIconMobile },
    { path: '/search', icon: searchIcon, iconActive: searchIconActive, iconMobile: searchIconMobile },
    { path: '/chats', icon: chatIcon, iconActive: chatIconActive, iconMobile: chatIconMobile },
    { path: '/profile', icon: profileIcon, iconActive: profileIconActive, iconMobile: profileIconMobile },
];

export default function Header() {
    const { pathname } = useLocation();

    return (
        <header className="header container">
            <div className="header__inner">
                <nav className="header__nav">
                    <ul className="header__nav-list">
                        {navItems.map(({ path, icon, iconActive, iconMobile }) => {
                            const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
                            const iconSrc = isActive ? iconActive : icon;
                            return (
                                <li key={path} className="header__nav-item">
                                    <ButtonLink
                                        className={`header__nav-link${isActive ? ' header__nav-link--active' : ''}`}
                                        to={path}
                                    >
                                        <picture>
                                            <source media="(max-width: 767px)" srcSet={iconMobile} />
                                            <img src={iconSrc} width={60} height={60} loading="lazy" alt="icon" className="header__nav-icon" />
                                        </picture>
                                    </ButtonLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="header__logo">
                    <Logo className="logo__image" />
                </div>
            </div>
        </header>
    );
}
