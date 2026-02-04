import Organization from "./Organization.jsx";

export default function OrganizationList({ organizations = [], className = '', classNameItem = '' }) {
    return (
        <ul className={`organization__list ${className}`}>
            {organizations.map((organization) => (
                <li key={organization.id} className={`organization__item ${classNameItem}`}>
                    <Organization organization={organization} />
                </li>
            ))}
        </ul>
    );
}
