import Complaint from "./Complaint.jsx";

export default function ComplaintList({ complaints = [], className = '' }) {
    return (
        <>
            <div className={`complaint-list ${className}`}>
                <ul className="complaint-list__list">
                    {complaints.map((complaint) => (
                        <li key={complaint.id} className="complaint-list__item">
                            <Complaint />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

