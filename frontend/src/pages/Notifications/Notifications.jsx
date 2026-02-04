import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import backIcon from "../../assets/images/Notifications/back.svg";
import NotificationList from "../../components/Notification/NotificationList.jsx";

export default function Notifications() {
    return (
        <>
            <Header />
            <div className="notifications block container">
                <div className="notifications__inner block__inner">
                    <header className="notifications__header">
                        <ButtonLink to={'/feed'} className={"notifications__link"}>
                            <img src={backIcon} width={36} height={36} loading='lazy' alt="" className="notifications__link-icon"/>
                        </ButtonLink>
                        <h1 className="notifications__title">Notifications</h1>
                    </header>

                    <div className="notifications__body">
                        <NotificationList
                            notifications={[
                                { id: 1 },
                                { id: 2 },
                                { id: 3 },
                                { id: 4 },
                                { id: 5 },
                                { id: 6 },
                                { id: 7 },
                                { id: 8 },
                                { id: 9 },
                                { id: 10 },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
