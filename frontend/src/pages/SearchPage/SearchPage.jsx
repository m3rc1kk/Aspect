import { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Search from "../../components/Search/Search.jsx";
import PostList from "../../components/Post/PostList.jsx";
import UserList from "../../components/User/UserList.jsx";
import OrganizationList from "../../components/Organization/OrganizationList.jsx";
import { searchApi } from "../../api/searchApi.js";
import { usersApi } from "../../api/usersApi.js";

export default function SearchPage() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            const [data, me] = await Promise.all([
                searchApi.search(query),
                currentUserId ? Promise.resolve({ id: currentUserId }) : usersApi.getCurrentUser(),
            ]);
            if (!currentUserId && me?.id) setCurrentUserId(me.id);
            setResults(data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const hasResults = results && (
        (results.users && results.users.length > 0) ||
        (results.posts && results.posts.length > 0) ||
        (results.organizations && results.organizations.length > 0)
    );

    return (
        <>
            <Header />
            <div className="search-page block container">
                <div className="search-page__inner block__inner">
                    <Search className="search-page__search" onSearch={handleSearch} />

                    {loading && (
                        <p className="search-page__loading">Searching...</p>
                    )}

                    {results && !loading && !hasResults && (
                        <p className="search-page__empty">Nothing found</p>
                    )}

                    {!loading && hasResults && (
                        <div className="search-page__results">
                            {results.users && results.users.length > 0 && (
                                <UserList
                                    users={results.users}
                                    title="Users"
                                    description={`${results.users.length} found`}
                                    className="search-page__users"
                                />
                            )}

                            {results.organizations && results.organizations.length > 0 && (
                                <div className="search-page__organizations">
                                    <h2 className="search-page__section-title">Organizations</h2>
                                    <OrganizationList
                                    organizations={results.organizations}
                                    className="search-page__organizations-list"
                                    classNameItem="search-page__organizations-item"
                                />
                                </div>
                            )}

                            {results.posts && results.posts.length > 0 && (
                                <div className="search-page__posts">
                                    <h2 className="search-page__section-title">Posts</h2>
                                    <PostList
                                        posts={results.posts}
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {!results && !loading && (
                        <div className="search-page__hint">
                            <p className="search-page__hint-text">Search something..</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
