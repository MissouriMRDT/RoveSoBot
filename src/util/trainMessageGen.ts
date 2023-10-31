import { User } from 'discord.js';

function userList(list: User[]): string {
    if (list.length === 0) return '';
    if (list.length === 1) return list[0].toString();
    const firsts = list.slice(0, list.length - 1);
    const last = list[list.length - 1];
    return firsts.join(', ') + ' and ' + last.toString();
}

function updateMsg(
    conductor: User,
    joined: User[],
    dest: string,
    time: moment.Moment,
    type: 'lunch' | 'party'
): string {
    const typeString = type == 'lunch' ? 'Lunch Train' : 'Party Bus';
    const timeFormatted = time.format('h:mm a');
    const dateFormatted = time.format('MM/DD/YYYY');

    const createdSentence = `${conductor} has created a ${typeString} to ${dest} at ${timeFormatted} on ${dateFormatted}. `;
    const joinedSentence = `${userList(joined)} ${joined.length > 1 ? 'have' : 'has'} joined, hop in! `;
    const membersNote = `(${joined.length + 1} member${joined.length > 0 ? 's' : ''})`;
    return `${createdSentence}${joined.length > 0 ? joinedSentence : ''}${membersNote}`;
}

function trainLeaveMsg(conductor: User, joined: User[], dest: string, type: 'lunch' | 'party'): string {
    const lunchAboard = 'All aboard, the train is departing! ';
    const partyAboard = 'Time to party! ';
    const joinedSentence = `${userList([...joined, conductor])} meet at ${dest}! `;
    const membersNote = `(${joined.length + 1} member${joined.length > 0 ? 's' : ''})`;
    return `${type == 'lunch' ? lunchAboard : partyAboard}${joinedSentence}${membersNote}`;
}

export { updateMsg, trainLeaveMsg };
