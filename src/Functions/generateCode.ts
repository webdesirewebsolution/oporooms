function generateCode() {
    // Generate a random number between 0 and 99999
    const randomNum = Math.floor(Math.random() * 100000);

    // Convert the number to a string and pad it with leading zeros if necessary
    const randomCode = randomNum.toString().padStart(6, '0');

    return randomCode;
}

export default generateCode