import ButtonLink from "../Button/Button.jsx";

import avatar from '../../assets/images/Profile/avatar.png'
import like from '../../assets/images/Notifications/like.svg'
import arrow from '../../assets/images/Organization/arrow.svg'

export default function Notification() {

    return (
        <>
            <div className="notification">
                <ButtonLink to={'/'} className="notification__inner">
                    <div className="notification__author">
                        <img src={avatar} width={42} height={42} loading='lazy' alt="" className="notification__avatar"/>
                        <div className="notification__author-body">
                            <h1 className="notification__username">Donald Trump</h1>
                            <span className="notification__action">Liked your comment</span>
                        </div>
                    </div>

                    <div className="notification__body">
                        <img src={like} width={28} height={28} loading='lazy' alt="" className="notification__icon"/>
                        <img src={arrow} width={12} height={24} loading='lazy' alt="" className="notification__arrow"/>
                    </div>
                </ButtonLink>
            </div>
        </>
    )
}