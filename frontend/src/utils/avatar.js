import { getMediaUrl } from '../api/axiosConfig';
import defaultAvatar from '../assets/images/avatar.png';

/**
 * Returns full avatar URL for display. Uses default avatar if path is empty.
 * @param {string|null|undefined} avatarPath - Path from API (e.g. /media/avatars/...) or null
 * @returns {string} URL for <img src={...} />
 */
export function getAvatarUrl(avatarPath) {
    const url = getMediaUrl(avatarPath);
    return url || defaultAvatar;
}

export { defaultAvatar };
