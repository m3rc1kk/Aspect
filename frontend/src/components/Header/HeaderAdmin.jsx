import { useLocation } from 'react-router-dom';
import ButtonLink from "../Button/Button.jsx";
import Logo from "../Logo/Logo.jsx";


import statsIcon from "../../assets/images/Admin/stats.svg";
import statsIconActive from "../../assets/images/Admin/stats-active.svg";
import statsIconMobile from "../../assets/images/Admin/stats-mobile.svg";
import complaintsIcon from "../../assets/images/Admin/complaints.svg";
import complaintsIconActive from "../../assets/images/Admin/complaints-active.svg";
import complaintsIconMobile from "../../assets/images/Admin/complaints-mobile.svg";
import backIcon from "../../assets/images/Admin/back.svg";
import backIconMobile from "../../assets/images/Admin/back-mobile.svg";

const navItems = [
    { path: '/feed', icon: backIcon, iconActive: backIcon, iconMobile: backIconMobile },
    { path: '/admin/stats', icon: statsIcon, iconActive: statsIconActive, iconMobile: statsIconMobile },
    { path: '/admin/complaints', icon: complaintsIcon, iconActive: complaintsIconActive, iconMobile: complaintsIconMobile },
];

export default function HeaderAdmin() {
    const { pathname } = useLocation();

    return (
        <>
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
                                                <img src={iconSrc} width={60} height={60} loading='lazy' alt="icon" className="header__nav-icon" />
                                            </picture>
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
