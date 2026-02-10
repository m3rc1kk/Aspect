import { useRef } from "react";
import User from "./User.jsx";
import ButtonLink from "../Button/Button.jsx";
import leftIcon from '../../assets/images/User/left.svg'
import rightIcon from '../../assets/images/User/right.svg'

export default function UserList({
    users = [],
    className = '',
    classNameItem = '',
    title = 'You may like...',
    description = 'Popular people',
}) {
    const listRef = useRef(null);
а
    const handleScrollLeft = () => {
        if (listRef.current) {
            const firstItem = listRef.current.querySelector('.user__item');
            const gap = 12;
            const scrollAmount = firstItem ? firstItem.offsetWidth + gap : 200;
            listRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleScrollRight = () => {
        if (listRef.current) {
            const firstItem = listRef.current.querySelector('.user__item');
            const gap = 12;
            const scrollAmount = firstItem ? firstItem.offsetWidth + gap : 200;
            listRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <div className={`user__block ${className}`}>
                <header className="user__header">
                    <div className="user__header-body">
                        <h1 className="user__title">{title}</h1>
                        <span className="user__description">{description}</span>
                    </div>
                    <div className="user__buttons">
                        <ButtonLink className={'user__button'} onClick={handleScrollLeft}>
                            <img src={leftIcon} height={36} width={36} loading='lazy' alt="" className="user__button-icon"/>
                        </ButtonLink>
                        <ButtonLink className={'user__button'} onClick={handleScrollRight}>
                            <img src={rightIcon} height={36} width={36} loading='lazy' alt="" className="user__button-icon"/>
                        </ButtonLink>
                    </div>
                </header>
                <ul ref={listRef} className='user__list'>
                    {users.map((user) => (
                        <li key={user.id} className={`user__item ${classNameItem}`}>
                            <User user={user} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

