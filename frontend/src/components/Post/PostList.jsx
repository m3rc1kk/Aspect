import Post from "./Post.jsx";

export default function PostList({ posts = [], className = '', classNameItem = '' }) {
    return (
        <ul className={`post__list ${className}`}>
            {posts.map((post) => (
                <li key={post.id} className={`post__item ${classNameItem}`}>
                    <Post post={post} />
                </li>
            ))}
        </ul>
    );
}
