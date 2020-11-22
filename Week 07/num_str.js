function StringToNumber(str){
    if(str.startsWith("0b")){
        return parseInt(str.substring(2), 2);
    } else if(str.startsWith("0o")){
        return parseInt(str.substring(2), 8);
    } else if(str.startsWith("0x")){
        return parseInt(str.substring(2), 16);
    } else {
        return parseInt(str, 10);
    }
}

function NumberToString(num, base){
    switch(base){
        case 2:
            return "0b"+num.toString(base);
        case 8:
            return "0o"+num.toString(base);
        case 10:
            return num.toString(base);
        case 16:
            return "0x"+num.toString(base);
    }
}