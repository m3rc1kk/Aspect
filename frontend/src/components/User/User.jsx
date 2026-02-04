import userAvatarDefault from '../../assets/images/User/UserAvatar.png'

export default function User({ user = {} }) {
    const {
        avatar = userAvatarDefault,
        nickname = 'Auroman',
        username = '@auroman',
    } = user;

    return (
        <>
            <div className="user">
                <div className="user__inner">
                    <img src={avatar} width={150} height={150} alt="" className="user__avatar"/>
                    <div className="user__body">
                        <h1 className="user__nickname">{nickname}</h1>
                        <span className="user__username">{username}</span>
                    </div>
                </div>
            </div>
        </>
    )
}