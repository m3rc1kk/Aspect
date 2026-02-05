import icon from '../../assets/images/Admin/stats/total-users.svg'

export default function StatsBlock() {
    return (
        <>
            <div className="stats-block">
                <div className="stats-block__inner">
                    <img src={icon} width={90} height={90} loading='lazy' alt="" className="stats-block__icon"/>
                    <div className="stats-block__body">
                        <h1 className="stats-block__title">Total users</h1>
                        <span className="stats-block__value">423.342</span>
                    </div>
                </div>
            </div>
        </>
    );
}

