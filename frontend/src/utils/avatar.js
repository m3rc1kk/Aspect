import { getMediaUrl } from '../api/axiosConfig';
import defaultAvatar from '../assets/images/avatar.png';

export function getAvatarUrl(avatarPath) {
    const url = getMediaUrl(avatarPath);
    return url || defaultAvatar;
}

export { defaultAvatar };
