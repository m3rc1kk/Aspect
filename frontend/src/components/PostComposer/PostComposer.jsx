import { useState } from "react";
import ButtonLink from "../Button/Button.jsx";
import fileIcon from "../../assets/images/PostComposer/file.svg";
import postSendIcon from "../../assets/images/PostComposer/post-send.svg";

export default function PostComposer({ placeholder = "How's life?)", onSubmit }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e?.preventDefault();
        onSubmit?.(text);
        setText("");
    };

    return (
        <div className="post-composer">
            <form className="post-composer__inner" onSubmit={handleSubmit}>
                <textarea
                    className="post-composer__textarea"
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                />
                <div className="post-composer__actions">
                    <ButtonLink
                        type="button"
                        className="post-composer__attach"
                        onClick={() => {}}
                        aria-label="Attach media"
                    >
                        <img src={fileIcon} alt="" width={24} height={24} loading="lazy" />
                    </ButtonLink>
                    <ButtonLink
                        type="submit"
                        className="post-composer__send"
                        aria-label="Send post"
                    >
                        <img src={postSendIcon} alt="" width={24} height={24} loading="lazy" />
                    </ButtonLink>
                </div>
            </form>
        </div>
    );
}
