export const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  } as const
  
  export const getOrdinalSuffix = (day: number): string => {
    const j = day % 10
    const k = day % 100
    if (j === 1 && k !== 11) return `${day}st`
    if (j === 2 && k !== 12) return `${day}nd`
    if (j === 3 && k !== 13) return `${day}rd`
    return `${day}th`
  }