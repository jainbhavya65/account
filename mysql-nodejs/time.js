let firstDate = new Date("7/13/2016"),
    secondDate = new Date("09/15/2017"),
    timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
    timeDiffrenece = Math.ceil(timeDifference / (1000 * 3600 * 24));
console.log(timeDifference);
