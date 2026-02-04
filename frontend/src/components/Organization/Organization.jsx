import avatar from '../../assets/images/Organization/avatar.svg'
import arrow from '../../assets/images/Organization/arrow.svg'
import ButtonLink from "../Button/Button.jsx";

export default function Organization() {
    return (
        <>
            <div className="organization">
                <ButtonLink to={'/'} className="organization__inner">
                    <img src={avatar} height={52} width={52} loading='lazy' alt="" className="organization__avatar"/>
                    <div className="organization__info">
                        <h1 className="organization__title">Uebki News</h1>
                        <span className="organization__followers">105 followers</span>
                    </div>

                    <img src={arrow} width={12} height={24} loading='lazy' alt="" className="organization__arrow"/>
                </ButtonLink>
            </div>
        </>
    )
}