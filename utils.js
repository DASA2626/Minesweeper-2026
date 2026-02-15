
// function getRandomIntInclusive(max,nin) {
//     return Math.floor(Math.random())*gLevel.SIZE
// }




function getFormatedTimePassed(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    const milliSeconds = ((timeDiff - seconds * 1000) + '').padStart(3, '0')
    return `${(seconds +'').padStart(2, '0')} : ${milliSeconds}`
  }
  