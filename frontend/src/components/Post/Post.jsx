import ButtonLink from "../Button/Button.jsx";
import reportIcon from '../../assets/images/Post/report.svg'
import shareIcon from '../../assets/images/Post/share.svg'
import likeIcon from '../../assets/images/Post/like.svg'
import commentIcon from '../../assets/images/Post/comment.svg'
import avatar from '../../assets/images/Profile/avatar.png'

export default function Post() {
    return (
        <>
            <div className="post">
                <div className="post__inner">
                    <header className="post__header">
                        <div className="post__author">
                            <img src={avatar} width={40} height={40} loading='lazy' alt="" className="post__author-image"/>
                            <div className="post__author-data">
                                <h1 className="post__author-nickname">Donald Trump</h1>
                                <span className="post__date">3 days ago</span>
                            </div>
                        </div>
                        <div className="post__header-buttons">
                            <ButtonLink to={'/'} className={'post__header-button'}>
                                <img src={reportIcon} alt="Button" width={36} height={36} loading='lazy' className="post__header-button-icon"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className={'post__header-button'}>
                                <img src={shareIcon} alt="Button" width={36} height={36} loading='lazy' className="post__header-button-icon"/>
                            </ButtonLink>
                        </div>
                    </header>

                    <div className="post__text">
                        <p>
                            I have been briefed on the Record Cold Wave and Historic Winter Storm that will be hitting much of the United States this weekend. The Trump Administration is coordinating with State and Local Officials. FEMA is fully prepared to respond. Stay Safe and Stay Warm! President DJT
                        </p>
                    </div>

                    <div className="post__buttons">
                        <ButtonLink to={'/'} className={'post__button'}>
                            <img src={likeIcon} alt="Button" width={28} height={28} loading='lazy' className="post__button-icon"/> <span className="post__button-quantity">1.2m</span>
                        </ButtonLink>
                        <ButtonLink to={'/'} className={'post__button'}>
                            <img src={commentIcon} alt="Button" width={28} height={28} loading='lazy' className="post__button-icon"/> <span className="post__button-quantity">433.3k</span>
                        </ButtonLink>
                    </div>

                </div>
            </div>
        </>
    )
}