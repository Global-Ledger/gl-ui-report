import moment from "moment";

export const alarmActiveTo = (date, edgeDuration = 3) => {
    if (!date) return false

    const duration = moment.duration(moment(date).diff(moment(new Date())));

    return duration.asDays() < edgeDuration;
}