const numberFormatter = (num: number): string => {

    if(num > 1000_000_000){
        return Math.abs(num/1000_000_000).toFixed(2) + "B"
    }
    if(num > 1000_000){
        return Math.abs(num/1000_000).toFixed(2) + "M"
    }
    if(num > 1000){
        return Math.abs(num/1000).toFixed(1) + "K"
    }

    return num.toString()
}

export default numberFormatter