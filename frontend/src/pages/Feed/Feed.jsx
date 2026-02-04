import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";
import PostList from "../../components/Post/PostList.jsx";
import UserList from "../../components/User/UserList.jsx";

import avatar from '../../assets/images/Profile/avatar.png';
import notif from '../../assets/images/Feed/notif.svg';
import Search from "../../components/Search/Search.jsx";


export default function Feed() {
    return (
        <>
            <Header />
            <div className="feed block container">
                <div className="feed__inner block__inner">
                    <header className="feed__header">
                        <div className="feed__header-body">
                            <img src={avatar} width={60} height={60} alt="" className="feed__avatar" />
                            <div className="feed__header-info">
                                <h1 className="feed__hello">Hello, Mr. Trump!</h1>
                                <span className="feed__description">Ready for fresh news?</span>
                            </div>
                        </div>
                        <ButtonLink className="feed__button-notif" to={'/notifications'}>
                            <img src={notif} width={60} height={60} loading="lazy" alt="" className="feed__button-notif-icon" />
                        </ButtonLink>
                    </header>

                    <Search className="feed__search"/>

                    <PostComposer />
                    <PostList
                        posts={[
                            { id: 1 },
                            { id: 2 },
                        ]}
                    />
                    <UserList
                        className={'feed__user-list'}
                        users={[
                            { id: 1, nickname: 'Auroman', username: '@auroman' },
                            { id: 2, nickname: 'John Doe', username: '@johndoe' },
                            { id: 3, nickname: 'Jane Smith', username: '@janesmith' },
                            { id: 4, nickname: 'Max Power', username: '@maxpower' },
                            { id: 5, nickname: 'Alice', username: '@alice' },
                            { id: 6, nickname: 'Bob', username: '@bob' },
                        ]}
                        title="You may like..."
                        description="Popular people"
                    />
                </div>
            </div>
        </>
    );
}
