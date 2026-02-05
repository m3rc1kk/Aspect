import HeaderAdmin from "../../../components/Header/HeaderAdmin.jsx";
import ComplaintList from "../../../components/Complaint/ComplaintList.jsx";


export default function AdminComplaints() {

    return (
        <>
            <HeaderAdmin />
            <div className="complaints block container">
                <div className="complaints__inner block__inner">
                    <header className="complaints__header">
                        <h1 className="complaints__title">Complaints</h1>
                    </header>

                    <div className="complaints__body">
                        <ComplaintList
                            complaints={[
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
