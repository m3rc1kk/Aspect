import search from "../../assets/images/Feed/search.svg";

export default function Search({ className = "" }) {
    return (
        <div className={`search ${className}`}>
            <img
                src={search}
                width={20}
                height={20}
                loading="lazy"
                alt=""
                className="search-icon"
            />
            <input
                type="text"
                className="search-input"
                placeholder="Let’s find something"
            />
        </div>
    );
}

