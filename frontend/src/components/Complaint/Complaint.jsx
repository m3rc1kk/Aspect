import ButtonLink from "../Button/Button.jsx";

import avatar from '../../assets/images/Profile/avatar.png'
import like from '../../assets/images/Notifications/like.svg'
import arrow from '../../assets/images/Organization/arrow.svg'

export default function Complaint() {

    return (
        <>
            <div className="complaint">
                <ButtonLink to={'/'} className="complaint__inner">
                    <div className="complaint__author">
                        <img src={avatar} width={42} height={42} loading='lazy' alt="" className="complaint__avatar" />
                        <div className="complaint__author-body">
                            <h1 className="complaint__username">Donald Trump</h1>
                            <span className="complaint__action">Report a comment</span>
                        </div>
                    </div>

                    <div className="complaint__body">
                        <img src={arrow} width={12} height={24} loading='lazy' alt="" className="complaint__arrow" />
                    </div>
                </ButtonLink>
            </div>
        </>
    )
}