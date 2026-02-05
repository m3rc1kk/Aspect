import StatsBlock from "./StatsBlock.jsx";

export default function StatsBlockList({ statsBlocks = [], className = '' }) {
    return (
        <>
            <div className={`stats-block-list ${className}`}>
                <ul className="stats-block-list__list">
                    {statsBlocks.map((statsBlock) => (
                        <li key={statsBlock.id} className="stats-block-list__item">
                            <StatsBlock />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
