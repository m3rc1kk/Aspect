import { Link } from 'react-router-dom';
import AwardIcon from '../AwardIcon/AwardIcon.jsx';

export default function User({ user = {} }) {
    const {
        id,
        avatar,
        nickname = 'User',
        username = '',
        awards,
    } = user;

    const displayUsername = username.startsWith('@') ? username : `@${username}`;
    const link = id ? `/profile/${id}` : '#';

    return (
        <Link to={link} className="user" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="user__inner">
                {avatar && <img src={avatar} width={150} height={150} alt="" className="user__avatar"/>}
                <div className="user__body">
                    <h1 className="user__nickname">
                        {nickname}
                        {awards?.length > 0 && <AwardIcon awards={awards} />}
                    </h1>
                    <span className="user__username">{displayUsername}</span>
                </div>
            </div>
        </Link>
    );
}
