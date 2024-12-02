function generateCode() {
    // Generate a random number between 0 and 99999
    let randomNum = Math.floor(Math.random() * 100000);

    // Convert the number to a string and pad it with leading zeros if necessary
    let randomCode = randomNum.toString().padStart(5, '0');

    return randomCode;
}

export default generateCode