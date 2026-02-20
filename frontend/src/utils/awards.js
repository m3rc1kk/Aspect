export const AWARD_LABELS = { flay: 'FLAY' };

export function getAwardsTooltip(awards) {
    if (!awards?.length) return '';
    return awards.map((code) => AWARD_LABELS[code] || code).join(', ');
}

export function getAwardLabels(awards) {
    if (!awards?.length) return [];
    return awards.map((code) => AWARD_LABELS[code] || code);
}
