import arrow from '../../assets/images/Organization/arrow.svg'
import verifIcon from '../../assets/images/verif.svg'
import ButtonLink from "../Button/Button.jsx";

export default function Organization({ organization = {} }) {
    const {
        id,
        avatar,
        nickname,
        username,
        followers_count,
        is_verified,
    } = organization;

    const displayName = nickname || username || 'Organization';
    const followersText = followers_count != null
        ? `${followers_count} followers`
        : '';
    const link = id ? `/organization/${id}` : '/';

    return (
        <div className="organization">
            <ButtonLink to={link} className="organization__inner">
                {avatar && <img src={avatar} height={52} width={52} loading='lazy' alt="" className="organization__avatar"/>}
                <div className="organization__info">
                    <h1 className="organization__title">
                        {displayName}
                        {is_verified && (
                            <span className="verified-icon" aria-hidden="true">
                                <img src={verifIcon} alt="" width={20} height={20} />
                            </span>
                        )}
                    </h1>
                    {followersText && <span className="organization__followers">{followersText}</span>}
                </div>
                <img src={arrow} width={12} height={24} loading='lazy' alt="" className="organization__arrow"/>
            </ButtonLink>
        </div>
    );
}
