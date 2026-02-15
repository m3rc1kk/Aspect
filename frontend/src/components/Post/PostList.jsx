import Post from "./Post.jsx";

export default function PostList({ posts = [], currentUserId, onDelete, className = '', classNameItem = '' }) {
    // Ensure posts is always an array
    const postsArray = Array.isArray(posts) ? posts : [];

    if (postsArray.length === 0) {
        return (
            <div className="post__empty">
                <p>No posts yet. Be the first to share something!</p>
            </div>
        );
    }

    return (
        <ul className={`post__list ${className}`}>
            {postsArray.map((post) => (
                <li key={post.id} className={`post__item ${classNameItem}`}>
                    <Post post={post} currentUserId={currentUserId} onDelete={onDelete} />
                </li>
            ))}
        </ul>
    );
}
