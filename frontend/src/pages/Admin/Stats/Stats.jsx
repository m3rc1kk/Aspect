import HeaderAdmin from "../../../components/Header/HeaderAdmin.jsx";
import StatsBlockList from "../../../components/StatsBlock/StatsBlockList.jsx";


export default function AdminStats() {

    return (
        <>
            <HeaderAdmin />
            <div className="stats block container">
                <div className="stats__inner block__inner">
                    <header className="stats__header">
                        <h1 className="stats__title">Stats</h1>
                    </header>

                    <div className="stats__body">
                        <StatsBlockList
                            statsBlocks={[
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
