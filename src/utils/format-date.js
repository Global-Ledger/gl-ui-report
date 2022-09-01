import format from 'date-fns/format'
export const formatDate = (date, dateFormat = 'dd.MM.yyyy HH:mm:SS') => {
    return format(new Date(date), dateFormat)
}
