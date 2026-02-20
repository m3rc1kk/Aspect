import { useState } from "react";
import search from "../../assets/images/Feed/search.svg";

export default function Search({ className = "", onSearch }) {
    const [query, setQuery] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim() && onSearch) {
            onSearch(query.trim());
        }
    };

    return (
        <div className={`search ${className}`}>
            <img
                src={search}
                width={20}
                height={20}
                loading="lazy"
                alt=""
                className="search-icon"
                style={{ cursor: onSearch ? 'pointer' : 'default' }}
                onClick={() => {
                    if (query.trim() && onSearch) onSearch(query.trim());
                }}
            />
            <input
                type="text"
                className="search-input"
                placeholder="Let's find something"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
