import Header from "../../components/Header/Header.jsx";
import Search from "../../components/Search/Search.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import search from "../../assets/images/search.svg"

export default function SearchPage() {
    return (
        <>
            <Header />
            <div className="search-page block container">
                <div className="search-page__inner block__inner">
                    <Search className="search-page__search"/>

                    <div className="search-page__popular">
                        <h1 className="search-page__popular-title">Popular Queries</h1>
                        <ul className="search-page__popular-list">
                            <li className="search-page__popular-item">
                                <ButtonLink to="/" className={'search-page__popular-link'}>
                                    <div className="search-page__popular-body">
                                        <img src={search} height={20} width={20} loading='lazy' alt="" className="search-page__popular-icon"/>
                                        <span className="search-page__popular-text">Where is Greenland?</span>
                                    </div>
                                    <span className="search-page__popular-count">424k</span>
                                </ButtonLink>
                            </li>
                            <li className="search-page__popular-item">
                                <ButtonLink to="/" className={'search-page__popular-link'}>
                                    <div className="search-page__popular-body">
                                        <img src={search} height={20} width={20} loading='lazy' alt="" className="search-page__popular-icon"/>
                                        <span className="search-page__popular-text">Where is Greenland?</span>
                                    </div>
                                    <span className="search-page__popular-count">424k</span>
                                </ButtonLink>
                            </li>
                            <li className="search-page__popular-item">
                                <ButtonLink to="/" className={'search-page__popular-link'}>
                                    <div className="search-page__popular-body">
                                        <img src={search} height={20} width={20} loading='lazy' alt="" className="search-page__popular-icon"/>
                                        <span className="search-page__popular-text">Where is Greenland?</span>
                                    </div>
                                    <span className="search-page__popular-count">424k</span>
                                </ButtonLink>
                            </li>
                            <li className="search-page__popular-item">
                                <ButtonLink to="/" className={'search-page__popular-link'}>
                                    <div className="search-page__popular-body">
                                        <img src={search} height={20} width={20} loading='lazy' alt="" className="search-page__popular-icon"/>
                                        <span className="search-page__popular-text">Where is Greenland?</span>
                                    </div>
                                    <span className="search-page__popular-count">424k</span>
                                </ButtonLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
